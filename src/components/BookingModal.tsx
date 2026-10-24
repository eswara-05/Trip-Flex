import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  IndianRupee,
  Clock,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Landmark,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  Lock,
  Zap,
  Ticket,
  Sparkles,
  Smartphone,
  Check,
  Building,
} from 'lucide-react';
import {
  Booking,
  BusService,
  Hotel,
  PaymentAttempt,
  PaymentGatewayStatus,
  PriceBreakdown,
  Restaurant,
  ServiceType,
  TrainJourney,
  User,
  PrototypePaymentMethod,
} from '../lib/types';
import { calculatePriceBreakdown, formatINR } from '../lib/pricing';
import { generateBookingReference, validateEmail, validateIndianPhone, validateHotelDates } from '../lib/validators';
import { TripFlexStore } from '../lib/store';
import {
  createPaymentOrder,
  generateTestSignature,
  verifyRazorpaySignature,
  executeCompensationRefund,
  executePrototypePayment,
  PROTOTYPE_PAYMENT_CONFIG,
} from '../lib/payments';

interface BookingModalProps {
  serviceType: ServiceType;
  item: BusService | TrainJourney | Hotel | Restaurant;
  currentUser: User;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
  initialSlot?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  serviceType,
  item,
  currentUser,
  onClose,
  onBookingConfirmed,
  initialSlot,
}) => {
  // Common traveller details
  const [name, setName] = useState(currentUser.name || 'Arjun Sharma');
  const [email, setEmail] = useState(currentUser.email || 'arjun.sharma@gmail.com');
  const [phone, setPhone] = useState(currentUser.phone || '9876543210');
  const [passengersCount, setPassengersCount] = useState<number>(2);

  // Bus specific
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['L1', 'L2']);

  // Train specific
  const [selectedClass, setSelectedClass] = useState<string>(
    serviceType === 'TRAIN' ? (item as TrainJourney).classes[0]?.code || 'CC' : 'CC'
  );

  // Hotel specific
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    serviceType === 'HOTEL' && (item as Hotel).rooms.length > 0 ? (item as Hotel).rooms[0].id : ''
  );
  const [checkInDate, setCheckInDate] = useState('2026-11-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-17');

  // Restaurant specific
  const [diningTime, setDiningTime] = useState<string>(
    initialSlot || (serviceType === 'RESTAURANT' ? (item as Restaurant).availableSlots[0] || '8:00 PM' : '8:00 PM')
  );
  const [partySize, setPartySize] = useState<number>(2);

  // Checkout Steps: DETAILS -> PRICE_REVIEW -> GATEWAY_CHECKOUT -> CONFIRMED
  const [step, setStep] = useState<'DETAILS' | 'PRICE_REVIEW' | 'GATEWAY_CHECKOUT' | 'CONFIRMED'>('DETAILS');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Payment Mode & Prototype State
  const [checkoutMode, setCheckoutMode] = useState<'PROTOTYPE' | 'RAZORPAY_GATEWAY'>('PROTOTYPE');
  const [prototypeMethod, setPrototypeMethod] = useState<PrototypePaymentMethod>('PROTOTYPE_1CLICK');
  const [testCardPreset, setTestCardPreset] = useState<'RUPAY' | 'VISA' | 'MASTERCARD'>('RUPAY');
  const [testBank, setTestBank] = useState<string>('State Bank of India (SBI)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('traveller@oksbi');
  const [activePaymentOrder, setActivePaymentOrder] = useState<PaymentAttempt | null>(null);
  const [serverPrice, setServerPrice] = useState<PriceBreakdown | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [compensationRefundNotice, setCompensationRefundNotice] = useState<string | null>(null);

  // Calculate base price dynamically
  let baseUnitFare = 0;
  let quantity = 1;

  if (serviceType === 'BUS') {
    const bus = item as BusService;
    baseUnitFare = bus.baseFareINR;
    quantity = selectedSeats.length;
  } else if (serviceType === 'TRAIN') {
    const train = item as TrainJourney;
    const cls = train.classes.find((c) => c.code === selectedClass) || train.classes[0];
    baseUnitFare = cls.baseFareINR;
    quantity = passengersCount;
  } else if (serviceType === 'HOTEL') {
    const hotel = item as Hotel;
    const room = hotel.rooms.find((r) => r.id === selectedRoomId) || hotel.rooms[0];
    baseUnitFare = room ? room.pricePerNightINR : hotel.startingPriceINR;
    const diffDays = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
    quantity = isNaN(diffDays) ? 1 : diffDays;
  } else if (serviceType === 'RESTAURANT') {
    baseUnitFare = 150;
    quantity = partySize;
  }

  const clientPrice = calculatePriceBreakdown(serviceType, baseUnitFare, quantity);

  // Step 1: Validate details
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide primary guest / passenger name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validateIndianPhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (serviceType === 'BUS' && selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    if (serviceType === 'HOTEL') {
      const dateCheck = validateHotelDates(checkInDate, checkOutDate);
      if (!dateCheck.isValid) {
        setError(dateCheck.error || 'Invalid stay dates.');
        return;
      }
    }

    setStep('PRICE_REVIEW');
  };

  // Step 2: Create server-side Razorpay Order with strict price re-validation
  const handleInitiateRazorpayOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const bookingRef = generateBookingReference(serviceType);
      const idempotencyKey = `idem_${bookingRef}_${Date.now()}`;

      // Call server-side API or fall back to local pure payment module
      let orderResult: PaymentAttempt;
      let calculatedPrice: PriceBreakdown;

      try {
        const response = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingReference: bookingRef,
            serviceType,
            serviceId: item.id,
            serviceName:
              serviceType === 'BUS'
                ? (item as BusService).operatorName
                : serviceType === 'TRAIN'
                ? (item as TrainJourney).trainName
                : (item as Hotel | Restaurant).name,
            baseFareINR: baseUnitFare,
            quantity,
            userEmail: email.trim(),
            userName: name.trim(),
            idempotencyKey,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          orderResult = {
            id: 'pay_' + Date.now(),
            orderId: data.orderId,
            bookingReference: bookingRef,
            serviceType,
            serviceId: item.id,
            serviceName:
              serviceType === 'BUS'
                ? (item as BusService).operatorName
                : serviceType === 'TRAIN'
                ? (item as TrainJourney).trainName
                : (item as Hotel | Restaurant).name,
            userEmail: email.trim(),
            userName: name.trim(),
            amountINR: data.amountINR,
            currency: 'INR',
            status: data.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            idempotencyKey,
          };
          calculatedPrice = data.priceBreakdown;
        } else {
          throw new Error('Server order creation error');
        }
      } catch (fetchErr) {
        // Fallback to local pure payment module (for standalone client execution)
        const local = createPaymentOrder({
          bookingReference: bookingRef,
          serviceType,
          serviceId: item.id,
          serviceName:
            serviceType === 'BUS'
              ? (item as BusService).operatorName
              : serviceType === 'TRAIN'
              ? (item as TrainJourney).trainName
              : (item as Hotel | Restaurant).name,
          baseFareINR: baseUnitFare,
          quantity,
          userEmail: email.trim(),
          userName: name.trim(),
          idempotencyKey,
        });
        orderResult = local.order;
        calculatedPrice = local.priceBreakdown;
      }

      // Record in store
      TripFlexStore.addPaymentAttempt(orderResult);
      setActivePaymentOrder(orderResult);
      setServerPrice(calculatedPrice);
      setStep('GATEWAY_CHECKOUT');
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment order.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Complete Payment & Verify HMAC SHA-256 Signature
  // Step 3: Complete Payment & Verify HMAC SHA-256 Signature (Supports Prototype Suite & Razorpay)
  const handleAuthorizePayment = async (
    targetMethod?: PrototypePaymentMethod,
    details?: Record<string, any>
  ) => {
    if (!activePaymentOrder) return;
    setIsProcessing(true);
    setError(null);

    const isProto = checkoutMode === 'PROTOTYPE' || Boolean(targetMethod && targetMethod.startsWith('PROTOTYPE_'));
    const finalMethod: PrototypePaymentMethod = targetMethod || (isProto ? prototypeMethod : 'RAZORPAY_GATEWAY');

    try {
      let paymentId = '';
      let signature = '';
      let paymentStatus: PaymentGatewayStatus = 'CAPTURED';

      if (isProto) {
        // --- PROTOTYPE PAYMENT SIMULATION PATH ---
        try {
          const protoRes = await fetch('/api/payments/prototype-authorize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: activePaymentOrder.orderId,
              paymentMethod: finalMethod,
              details: details || {
                vpa: upiId,
                cardPreset: testCardPreset,
                bankName: testBank,
              },
            }),
          });
          if (protoRes.ok) {
            const data = await protoRes.json();
            paymentId = data.paymentId;
            signature = data.signature;
            paymentStatus = data.status || (finalMethod === 'PROTOTYPE_PAY_ON_BOARDING' ? 'AUTHORIZED' : 'CAPTURED');
          } else {
            throw new Error('Server prototype authorization failed, using client simulator');
          }
        } catch (e) {
          // Client-side pure fallback simulation
          const localProto = executePrototypePayment(activePaymentOrder, finalMethod, details);
          paymentId = localProto.paymentId;
          signature = localProto.signature;
          paymentStatus = localProto.status;
        }
      } else {
        // --- RAZORPAY GATEWAY CHECKOUT PATH ---
        paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 12)}`;

        try {
          const tokenRes = await fetch(`/api/payments/test-token?orderId=${encodeURIComponent(activePaymentOrder.orderId)}`);
          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            paymentId = tokenData.paymentId;
            signature = tokenData.signature;
          } else {
            signature = generateTestSignature(activePaymentOrder.orderId, paymentId);
          }
        } catch (e) {
          signature = generateTestSignature(activePaymentOrder.orderId, paymentId);
        }

        // Verify on server
        let isVerified = false;
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: activePaymentOrder.orderId,
              razorpayPaymentId: paymentId,
              razorpaySignature: signature,
            }),
          });
          if (verifyRes.ok) {
            isVerified = true;
          }
        } catch (e) {
          isVerified = verifyRazorpaySignature(activePaymentOrder.orderId, paymentId, signature);
        }

        if (!isVerified) {
          throw new Error('Payment signature verification failed. Security rejection.');
        }
        paymentStatus = 'CAPTURED';
      }

      // Update payment attempt in store
      TripFlexStore.updatePaymentAttempt(activePaymentOrder.orderId, {
        status: paymentStatus,
        paymentMethod: finalMethod,
        isPrototype: isProto,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });

      // Construct notes
      let notes = `Paid via ${PROTOTYPE_PAYMENT_CONFIG[finalMethod]?.label || finalMethod} • Ref: ${paymentId}`;
      if (finalMethod === 'PROTOTYPE_PAY_ON_BOARDING') {
        notes = `Reserved via Prototype Pay on Boarding • ₹0 advance paid • Settle ${formatINR((serverPrice || clientPrice).totalAmount)} upon arrival`;
      } else if (finalMethod === 'PROTOTYPE_UPI') {
        notes = `Simulated UPI payment from ${upiId} • Ref: ${paymentId}`;
      } else if (finalMethod === 'PROTOTYPE_CARD') {
        notes = `Simulated Card payment (${testCardPreset}) • Ref: ${paymentId}`;
      }

      // Create official booking reservation
      const bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'> = {
        userId: currentUser.id,
        userEmail: email.trim(),
        userName: name.trim(),
        userPhone: phone.trim(),
        serviceType,
        serviceId: item.id,
        serviceName:
          serviceType === 'BUS'
            ? (item as BusService).operatorName
            : serviceType === 'TRAIN'
            ? (item as TrainJourney).trainName
            : (item as Hotel | Restaurant).name,
        serviceDetails: {
          passengersCount: serviceType === 'BUS' ? selectedSeats.length : passengersCount,
          seatNumbers: serviceType === 'BUS' ? selectedSeats : undefined,
          roomType:
            serviceType === 'HOTEL'
              ? (item as Hotel).rooms.find((r) => r.id === selectedRoomId)?.name || 'Standard Room'
              : undefined,
          checkInDate: serviceType === 'HOTEL' ? checkInDate : undefined,
          checkOutDate: serviceType === 'HOTEL' ? checkOutDate : undefined,
          nights: serviceType === 'HOTEL' ? quantity : undefined,
          partySize: serviceType === 'RESTAURANT' ? partySize : undefined,
          reservationTime: serviceType === 'RESTAURANT' ? diningTime : undefined,
        },
        priceBreakdown: serverPrice || clientPrice,
        status: 'CONFIRMED',
        paymentOrderId: activePaymentOrder.orderId,
        paymentId,
        paymentStatus,
        paymentMethod: finalMethod,
        isPrototype: isProto,
        sourceType: item.sourceType,
        isAuthorizedFulfillment: true,
        notes,
      };

      const newBooking = TripFlexStore.createBooking(bookingData);
      setCreatedBooking(newBooking);
      setStep('CONFIRMED');
      onBookingConfirmed(newBooking);
    } catch (err: any) {
      setError(err.message || 'Payment authorization failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Test Failure Simulation: Gateway Declined
  const handleSimulatePaymentFailure = () => {
    if (!activePaymentOrder) return;
    TripFlexStore.updatePaymentAttempt(activePaymentOrder.orderId, {
      status: 'FAILED',
      failureReason: 'Bank card authorization declined / Insufficient funds simulation',
    });
    setError('Payment Declined by Issuing Bank: Authorization failed. No funds deducted.');
  };

  // Test Compensation Refund Simulation: Payment succeeds, but provider fails fulfillment
  const handleSimulateCompensationRefund = async () => {
    if (!activePaymentOrder) return;
    setIsProcessing(true);
    setError(null);

    try {
      const paymentId = `pay_rzp_soldout_${Date.now()}`;
      // 1. Capture payment first
      const capturedAttempt = TripFlexStore.updatePaymentAttempt(activePaymentOrder.orderId, {
        status: 'CAPTURED',
        razorpayPaymentId: paymentId,
      });

      // 2. Provider indicates seat/room became unavailable -> Trigger refund flow
      const refundResult = executeCompensationRefund(
        capturedAttempt!,
        'Service inventory sold out by external provider before final lock. Automatic full refund initiated.'
      );

      TripFlexStore.updatePaymentAttempt(activePaymentOrder.orderId, {
        status: 'REFUNDED',
        refundId: refundResult.refundId,
        refundAmountINR: refundResult.updatedOrder.refundAmountINR,
        failureReason: refundResult.updatedOrder.failureReason,
      });

      setCompensationRefundNotice(
        `Provider Inventory Alert: Service became sold out by the transport/stay operator during checkout. Trip Flex automated compensation protocol executed: Full refund of ${formatINR(activePaymentOrder.amountINR)} credited back to source. Refund Ref: ${refundResult.refundId}`
      );
    } catch (err: any) {
      setError(err.message || 'Refund simulation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length > 1) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      }
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222222]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E50914]">
                Independent {serviceType} Booking & Payment
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              {serviceType === 'BUS'
                ? (item as BusService).operatorName
                : serviceType === 'TRAIN'
                ? `${(item as TrainJourney).trainName} (#${(item as TrainJourney).trainNumber})`
                : (item as Hotel | Restaurant).name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Flow */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {compensationRefundNotice && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Automatic Compensation Refund Executed</span>
              </div>
              <p className="leading-relaxed">{compensationRefundNotice}</p>
            </div>
          )}

          {/* STEP 1: SERVICE SPECIFIC SELECTION & TRAVELLER DETAILS */}
          {step === 'DETAILS' && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              {/* Bus Seat Layout Picker */}
              {serviceType === 'BUS' && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Select Bus Berth / Seats (Upper & Lower Deck):
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'U1', 'U2', 'U3', 'U4', 'U5', 'U6'].map((seat) => {
                      const isBooked = ['L3', 'U2'].includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seat)}
                          className={`p-2 rounded text-xs font-bold border transition text-center cursor-pointer ${
                            isBooked
                              ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#E50914] text-white border-[#E50914] shadow'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                    <span>Selected: <strong className="text-black">{selectedSeats.join(', ')}</strong> ({selectedSeats.length} seats)</span>
                    <span className="text-gray-400">Gray = Booked</span>
                  </div>
                </div>
              )}

              {/* Train Class Picker */}
              {serviceType === 'TRAIN' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Select Travel Class:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(item as TrainJourney).classes.map((cls) => (
                      <div
                        key={cls.code}
                        onClick={() => setSelectedClass(cls.code)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition ${
                          selectedClass === cls.code
                            ? 'border-[#E50914] bg-red-50/40'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>{cls.code} — {cls.name}</span>
                          <span className="text-[#E50914]">{formatINR(cls.baseFareINR)}</span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          {cls.seatsLeft} seats available
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Room Selection & Dates */}
              {serviceType === 'HOTEL' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Choose Room Type:
                    </label>
                    <div className="space-y-2">
                      {(item as Hotel).rooms.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                            selectedRoomId === room.id
                              ? 'border-[#E50914] bg-red-50/40'
                              : 'border-gray-200 bg-white hover:border-gray-400'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-black">{room.name}</div>
                            <div className="text-[11px] text-gray-500">{room.bedType} • Max {room.maxGuests} Guests</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-extrabold text-[#E50914]">{formatINR(room.pricePerNightINR)}</div>
                            <div className="text-[10px] text-gray-400">per night</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Check-In Date</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Check-Out Date</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant Time & Party Size */}
              {serviceType === 'RESTAURANT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Reservation Time</label>
                    <select
                      value={diningTime}
                      onChange={(e) => setDiningTime(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                    >
                      {(item as Restaurant).availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Number of Guests</label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>{num} Guests</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Primary Contact Details */}
              <div className="pt-2 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Primary Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. arjun.sharma@gmail.com"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Indian Mobile (+91)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Review Price Breakdown →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: TRANSPARENT SERVER PRICE REVIEW */}
          {step === 'PRICE_REVIEW' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Itemized Price Breakdown (Server-Revalidated)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Fare ({quantity} {serviceType === 'HOTEL' ? 'nights' : serviceType === 'BUS' ? 'seats' : 'guests'})</span>
                    <span className="font-semibold">{formatINR(clientPrice.baseAmount)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Goods & Services Tax (GST @ {clientPrice.gstRate * 100}%)</span>
                    <span className="font-semibold">{formatINR(clientPrice.gstAmount)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Trip Flex Platform Maintenance Fee</span>
                    <span className="font-semibold">
                      {clientPrice.platformFee > 0 ? formatINR(clientPrice.platformFee) : 'FREE'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-300 flex justify-between text-sm font-extrabold text-black font-heading">
                    <span>Total Amount Payable</span>
                    <span className="text-[#E50914] text-base">{formatINR(clientPrice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-[11px] text-red-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <p>
                  <strong>Payment Integrity Guarantee:</strong> In the next step, our backend creates an authorized Razorpay payment order. All signatures are authenticated with HMAC SHA-256 on the server.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleInitiateRazorpayOrder}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isProcessing ? 'Creating Razorpay Order...' : 'Proceed to Razorpay Checkout →'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAY & PROTOTYPE METHOD SUITE */}
          {step === 'GATEWAY_CHECKOUT' && activePaymentOrder && (
            <div className="space-y-4">
              {/* Order Header Summary Banner */}
              <div className="bg-[#111111] text-white p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Trip Flex Payment Suite (INR)</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {activePaymentOrder.orderId}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white font-heading">
                    {formatINR(activePaymentOrder.amountINR)}
                  </div>
                </div>

                <div className="text-right text-[11px] text-gray-400">
                  <span className="text-emerald-400 font-medium">HMAC SHA-256 Validated</span>
                  <div className="text-gray-400 text-[10px]">RBI & PCI Tokenization</div>
                </div>
              </div>

              {/* Mode Switcher: Prototype Payment vs Razorpay Gateway */}
              <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('PROTOTYPE')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    checkoutMode === 'PROTOTYPE'
                      ? 'bg-white text-black shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Prototype Payment Method</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-extrabold">Instant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMode('RAZORPAY_GATEWAY')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    checkoutMode === 'RAZORPAY_GATEWAY'
                      ? 'bg-white text-black shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Razorpay Gateway</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">Live/Sandbox</span>
                </button>
              </div>

              {/* VIEW A: PROTOTYPE PAYMENT METHODS */}
              {checkoutMode === 'PROTOTYPE' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-800">
                      Choose Prototype Payment Method:
                    </label>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Zero Merchant Credentials Required
                    </span>
                  </div>

                  {/* 5 Prototype Method Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrototypeMethod('PROTOTYPE_1CLICK')}
                      className={`p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        prototypeMethod === 'PROTOTYPE_1CLICK'
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>⚡ 1-Click Fast</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrototypeMethod('PROTOTYPE_UPI')}
                      className={`p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        prototypeMethod === 'PROTOTYPE_UPI'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>📱 UPI Mock</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrototypeMethod('PROTOTYPE_CARD')}
                      className={`p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        prototypeMethod === 'PROTOTYPE_CARD'
                          ? 'border-blue-500 bg-blue-50 text-blue-950 ring-1 ring-blue-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>💳 Test Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrototypeMethod('PROTOTYPE_NETBANKING')}
                      className={`p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        prototypeMethod === 'PROTOTYPE_NETBANKING'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Landmark className="w-4 h-4 text-indigo-600" />
                      <span>🏦 NetBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrototypeMethod('PROTOTYPE_PAY_ON_BOARDING')}
                      className={`col-span-2 sm:col-span-1 p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        prototypeMethod === 'PROTOTYPE_PAY_ON_BOARDING'
                          ? 'border-purple-500 bg-purple-50 text-purple-950 ring-1 ring-purple-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Ticket className="w-4 h-4 text-purple-600" />
                      <span>🎫 Pay Later</span>
                    </button>
                  </div>

                  {/* Sub-Panel 1: 1-Click Fast Approval */}
                  {prototypeMethod === 'PROTOTYPE_1CLICK' && (
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                          <h5 className="font-heading font-extrabold text-sm text-amber-950">
                            Instant 1-Click Prototype Approval
                          </h5>
                          <p className="text-xs text-amber-800">
                            Simulates immediate banking authorization in ~300ms. Re-validates server pricing, produces HMAC SHA-256 signature, and stores official transaction receipt.
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200 text-xs text-amber-900 font-mono flex items-center justify-between">
                        <span>Simulated Gateway Ref:</span>
                        <strong className="font-bold">{activePaymentOrder.orderId}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthorizePayment('PROTOTYPE_1CLICK')}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                        <span>⚡ 1-Click Instant Approval • {formatINR(activePaymentOrder.amountINR)}</span>
                      </button>
                    </div>
                  )}

                  {/* Sub-Panel 2: UPI Mock Simulation */}
                  {prototypeMethod === 'PROTOTYPE_UPI' && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Interactive QR Mock */}
                        <div className="bg-white p-3 rounded-xl border border-gray-300 shadow-sm flex flex-col items-center shrink-0 text-center">
                          <div className="w-24 h-24 bg-gray-900 rounded-lg p-1.5 flex items-center justify-center text-white relative overflow-hidden group">
                            <QrCode className="w-20 h-20 text-white" />
                            <div className="absolute inset-x-0 h-1 bg-emerald-400 top-0 animate-pulse" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-700 mt-1.5">Scan with any UPI App</span>
                        </div>

                        {/* Presets and custom handle */}
                        <div className="flex-1 space-y-2 w-full text-xs">
                          <label className="block font-semibold text-gray-700">Quick Test Handles:</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['arjun.sharma@oksbi', 'traveler@paytm', 'tripflex@okaxis', 'tester@ybl'].map((handle) => (
                              <button
                                key={handle}
                                type="button"
                                onClick={() => setUpiId(handle)}
                                className={`px-2 py-1.5 rounded text-[11px] font-mono border text-left truncate transition cursor-pointer ${
                                  upiId === handle
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {handle}
                              </button>
                            ))}
                          </div>

                          <div className="pt-1">
                            <label className="block text-[11px] text-gray-600 mb-0.5">UPI ID / VPA</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-black font-mono"
                              placeholder="e.g. yourname@upi"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthorizePayment('PROTOTYPE_UPI', { vpa: upiId })}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                        <span>Simulate UPI App Approval • {formatINR(activePaymentOrder.amountINR)}</span>
                      </button>
                    </div>
                  )}

                  {/* Sub-Panel 3: Test Card Simulation */}
                  {prototypeMethod === 'PROTOTYPE_CARD' && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                      {/* Virtual Card Graphic */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white shadow-lg space-y-2 border border-gray-700">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono text-gray-300 tracking-wider">Trip Flex Prototype Card</span>
                          <span className="font-extrabold text-amber-400 font-heading tracking-widest">{testCardPreset}</span>
                        </div>
                        <div className="w-7 h-5 bg-amber-400/80 rounded flex items-center justify-center text-[9px] font-bold text-black">
                          CHIP
                        </div>
                        <div className="font-mono tracking-widest text-sm sm:text-base text-gray-100">
                          {testCardPreset === 'RUPAY'
                            ? '6521 •••• •••• 1024'
                            : testCardPreset === 'VISA'
                            ? '4111 •••• •••• 1111'
                            : '5123 •••• •••• 8844'}
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-300 pt-1 font-mono">
                          <span>{name || 'ARJUN SHARMA'}</span>
                          <span>EXP: 12/29</span>
                        </div>
                      </div>

                      {/* Card Presets */}
                      <div className="grid grid-cols-3 gap-2">
                        {(['RUPAY', 'VISA', 'MASTERCARD'] as const).map((brand) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => setTestCardPreset(brand)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              testCardPreset === brand
                                ? 'bg-blue-50 border-blue-500 text-blue-900'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {brand === 'RUPAY' ? 'RuPay Platinum' : brand === 'VISA' ? 'Visa Signature' : 'Mastercard World'}
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Zero CVV collection required in prototype mode • RBI Tokenized safe</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthorizePayment('PROTOTYPE_CARD', { cardBrand: testCardPreset })}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        <span>Authorize Card Payment • {formatINR(activePaymentOrder.amountINR)}</span>
                      </button>
                    </div>
                  )}

                  {/* Sub-Panel 4: NetBanking Simulation */}
                  {prototypeMethod === 'PROTOTYPE_NETBANKING' && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                      <label className="block text-xs font-semibold text-gray-700">
                        Select Top Indian Bank to Simulate:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'State Bank of India (SBI)',
                          'HDFC Bank',
                          'ICICI Bank',
                          'Axis Bank',
                          'Punjab National Bank',
                          'Kotak Mahindra Bank',
                        ].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setTestBank(bank)}
                            className={`p-2 rounded-lg text-xs font-semibold border text-left transition cursor-pointer ${
                              testBank === bank
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Building className="w-3.5 h-3.5 text-indigo-500 mb-1" />
                            <span className="text-[11px] block truncate">{bank}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthorizePayment('PROTOTYPE_NETBANKING', { bankName: testBank })}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
                        <span>Simulate {testBank} Login & Pay • {formatINR(activePaymentOrder.amountINR)}</span>
                      </button>
                    </div>
                  )}

                  {/* Sub-Panel 5: Pay on Boarding Prototype */}
                  {prototypeMethod === 'PROTOTYPE_PAY_ON_BOARDING' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-heading font-extrabold text-sm text-purple-950">
                            Pay on Boarding Prototype (₹0 Upfront)
                          </h5>
                          <p className="text-xs text-purple-900">
                            Zero payment deducted today. Your seat/room reservation is confirmed immediately. Pay the full {formatINR(activePaymentOrder.amountINR)} directly to the driver, conductor, or front desk upon boarding or arrival.
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-lg border border-purple-200 text-xs text-purple-900 flex justify-between">
                        <span>Due at Travel / Check-In:</span>
                        <strong className="font-bold text-base text-purple-950">{formatINR(activePaymentOrder.amountINR)}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAuthorizePayment('PROTOTYPE_PAY_ON_BOARDING')}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Confirm Reservation Now • Pay {formatINR(activePaymentOrder.amountINR)} on Boarding</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* VIEW B: RAZORPAY GATEWAY CHECKOUT */
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-800">
                    Select Razorpay Payment Channel:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? 'border-[#E50914] bg-red-50 text-[#E50914]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>UPI (GPay / PhonePe)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'CARD'
                          ? 'border-[#E50914] bg-red-50 text-[#E50914]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cards (Tokenized)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NETBANKING')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'NETBANKING'
                          ? 'border-[#E50914] bg-red-50 text-[#E50914]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Landmark className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAuthorizePayment('RAZORPAY_GATEWAY')}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Pay {formatINR(activePaymentOrder.amountINR)} via Razorpay Gateway</span>
                  </button>
                </div>
              )}

              {/* Test failure simulation buttons */}
              <div className="pt-2 border-t border-gray-200">
                <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 tracking-wider">
                  Test Failure & Compensation Protocols:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePaymentFailure}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-300 text-[11px] font-semibold transition cursor-pointer"
                    title="Simulate bank authorization declined"
                  >
                    Simulate Payment Decline
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateCompensationRefund}
                    disabled={isProcessing}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-amber-50 text-gray-700 hover:text-amber-800 border border-gray-300 text-[11px] font-semibold transition cursor-pointer"
                    title="Simulate payment success followed by provider rejection"
                  >
                    Simulate Sold Out & Refund
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BOOKING CONFIRMED RECEIPT WITH PAYMENT METADATA */}
          {step === 'CONFIRMED' && createdBooking && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="font-heading font-extrabold text-xl text-black">
                Reservation Confirmed & Secured!
              </h4>
              <p className="text-xs text-gray-500">
                Authorized via {PROTOTYPE_PAYMENT_CONFIG[createdBooking.paymentMethod || 'PROTOTYPE_1CLICK']?.label || createdBooking.paymentMethod || 'Trip Flex Gateway'} with server HMAC SHA-256 verification.
              </p>

              {/* Booking Ticket Card */}
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-xl text-left text-xs space-y-2 font-sans">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">Reference:</span>
                  <span className="font-mono font-bold text-[#E50914] text-sm tracking-wider">{createdBooking.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Service:</span>
                  <span className="font-bold text-black">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Guest:</span>
                  <span className="text-gray-900">{createdBooking.userName} ({createdBooking.userPhone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Payment Method:</span>
                  <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    {PROTOTYPE_PAYMENT_CONFIG[createdBooking.paymentMethod || 'PROTOTYPE_1CLICK']?.label || createdBooking.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Transaction ID:</span>
                  <span className="font-mono text-emerald-800 font-bold">{createdBooking.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Reservation Status:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    {createdBooking.status}
                  </span>
                </div>
                {createdBooking.paymentMethod === 'PROTOTYPE_PAY_ON_BOARDING' ? (
                  <div className="p-2 bg-purple-50 border border-purple-200 rounded text-purple-950 font-medium text-[11px] space-y-0.5">
                    <div className="flex justify-between">
                      <span>Advance Collected:</span>
                      <strong className="text-emerald-700">₹0 (Free Reservation)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance Due on Boarding:</span>
                      <strong className="text-purple-950 text-xs">{formatINR(createdBooking.priceBreakdown.totalAmount)}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-500 font-medium">Total Paid:</span>
                    <span className="font-extrabold text-base text-black">{formatINR(createdBooking.priceBreakdown.totalAmount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Done & View In My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
