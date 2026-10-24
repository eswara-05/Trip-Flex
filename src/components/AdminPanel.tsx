import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Check,
  X,
  MapPin,
  Hotel as HotelIcon,
  Utensils,
  Bus,
  FileText,
  AlertCircle,
  RefreshCw,
  Database,
  CreditCard,
  Download,
  ToggleLeft,
  ToggleRight,
  Zap,
} from 'lucide-react';
import { AuditLog, Destination, Hotel, PaymentAttempt, Restaurant, User } from '../lib/types';
import { TripFlexStore } from '../lib/store';
import { formatINR } from '../lib/pricing';
import { PROTOTYPE_PAYMENT_CONFIG } from '../lib/payments';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  destinations: Destination[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  auditLogs: AuditLog[];
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  destinations,
  hotels,
  restaurants,
  auditLogs,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'destinations' | 'payments' | 'listings' | 'audit' | 'new_destination' | 'new_hotel'>('destinations');

  // Search filter for destination management
  const [destFilter, setDestFilter] = useState('');

  // Form states for new Destination
  const [destName, setDestName] = useState('');
  const [destState, setDestState] = useState('');
  const [destPopular, setDestPopular] = useState('');
  const [destTagline, setDestTagline] = useState('');
  const [destType, setDestType] = useState<any>('HERITAGE');
  const [destBusStation, setDestBusStation] = useState('');
  const [destRailStation, setDestRailStation] = useState('');

  // Form states for new Hotel
  const [hotelName, setHotelName] = useState('');
  const [hotelCity, setHotelCity] = useState(destinations[0]?.name || 'Jaipur');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelPrice, setHotelPrice] = useState(2500);
  const [hotelStars, setHotelStars] = useState(4);
  const [hotelDist, setHotelDist] = useState(1.5);

  const [message, setMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const paymentAttempts = TripFlexStore.getPaymentAttempts();
  const webhookEvents = TripFlexStore.getWebhookEvents();

  if (!isOpen) return null;

  const handleRunDataImport = () => {
    setIsImporting(true);
    const result = TripFlexStore.importDestinations(currentUser.email);
    setMessage(
      `Dataset Import Completed: Added ${result.addedCount} new destinations, updated ${result.updatedCount} records. Total dataset: ${result.totalCount} destinations across India with zero duplicates.`
    );
    onRefreshData();
    setIsImporting(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleToggleDestActive = (destId: string) => {
    TripFlexStore.toggleDestinationActive(destId, currentUser.email);
    onRefreshData();
  };

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName || !destState) return;

    const newDest: Destination = {
      id: 'dest-' + destName.toLowerCase().replace(/\s+/g, '-'),
      name: destName.trim(),
      state: destState.trim(),
      country: 'India',
      destinationType: destType,
      popularFor: destPopular.trim() || 'Heritage & Cultural Tourism',
      tagline: destTagline.trim() || `Explore the wonders of ${destName}.`,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 26.9124, lng: 75.7873 },
      majorHubs: {
        busStations: destBusStation ? [destBusStation] : ['Central Bus Stand'],
        railwayStations: destRailStation ? [destRailStation] : ['Central Junction'],
      },
      isActive: true,
      sourceType: 'ADMIN_MANAGED',
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };

    TripFlexStore.addDestination(newDest, currentUser.email);
    setMessage(`Successfully created Admin-Managed Destination: ${newDest.name}`);
    setDestName('');
    setDestState('');
    setDestPopular('');
    setDestTagline('');
    onRefreshData();
    setTimeout(() => setMessage(null), 3500);
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName || !hotelAddress) return;

    const newHotel: Hotel = {
      id: 'hotel-' + Date.now(),
      name: hotelName.trim(),
      city: hotelCity,
      address: hotelAddress.trim(),
      coordinates: { lat: 26.918, lng: 75.789 },
      distanceFromStationKm: Number(hotelDist),
      starRating: Number(hotelStars),
      guestRating: 4.8,
      reviewsCount: 1,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      description: 'Admin verified property with premium guest hospitality and amenities.',
      amenities: ['Free High-Speed WiFi', 'AC', '24/7 Front Desk', 'Complimentary Breakfast'],
      startingPriceINR: Number(hotelPrice),
      rooms: [
        {
          id: 'room-' + Date.now(),
          name: 'Executive Deluxe Room',
          description: 'Spacious AC room with king bed and city view.',
          maxGuests: 2,
          bedType: '1 King Bed',
          pricePerNightINR: Number(hotelPrice),
          availableRooms: 5,
          amenities: ['AC', 'WiFi', 'Breakfast'],
        },
      ],
      sourceType: 'ADMIN_MANAGED',
      verified: true,
    };

    TripFlexStore.addHotel(newHotel, currentUser.email);
    setMessage(`Successfully added Admin-Managed Hotel: ${newHotel.name}`);
    setHotelName('');
    setHotelAddress('');
    onRefreshData();
    setTimeout(() => setMessage(null), 3500);
  };

  const handleToggleHotelVerification = (hotelId: string) => {
    TripFlexStore.toggleHotelVerification(hotelId, currentUser.email);
    onRefreshData();
  };

  const handleToggleRestVerification = (restId: string) => {
    TripFlexStore.toggleRestaurantVerification(restId, currentUser.email);
    onRefreshData();
  };

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(destFilter.toLowerCase()) ||
      d.state.toLowerCase().includes(destFilter.toLowerCase()) ||
      d.destinationType.toLowerCase().includes(destFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-5xl w-full shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Admin Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-700/60 text-[#E50914]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                Trip Flex Admin Portal
              </h3>
              <p className="text-xs text-gray-400">
                Platform Operations, Geographic Datasets & Payment Audit • Logged in as <strong className="text-white">{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Subnav */}
        <div className="bg-[#1C1C1C] px-5 py-2.5 flex items-center gap-2 border-b border-gray-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'destinations' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Destinations ({destinations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & Gateway ({paymentAttempts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'listings' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Stays & Dining Directory ({hotels.length + restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('new_destination')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_destination' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </button>
          <button
            onClick={() => setActiveTab('new_hotel')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_hotel' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hotel</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#F7F7F7]">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* TAB: DESTINATION MANAGEMENT */}
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              {/* Import & Search Bar */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                <div>
                  <h4 className="font-heading font-extrabold text-base text-black flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#E50914]" />
                    <span>Indian Geographic Database</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Manage active travel destinations across India, toggle availability, and run deduplicated dataset imports.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunDataImport}
                    disabled={isImporting}
                    className="px-4 py-2 bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-bold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
                    title="Repeatable data import without creating duplicates"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isImporting ? 'Importing...' : 'Run Repeatable Import (Upsert)'}</span>
                  </button>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={destFilter}
                  onChange={(e) => setDestFilter(e.target.value)}
                  placeholder="Filter destinations by city, state, or type..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                />
              </div>

              {/* Destinations Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                  {filteredDestinations.map((dest) => (
                    <div key={dest.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black text-sm">{dest.name}</span>
                          <span className="text-gray-500 font-medium">({dest.state})</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                            {dest.destinationType}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            dest.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {dest.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          Hubs: {dest.majorHubs.railwayStations[0]} • {dest.majorHubs.busStations[0]}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleDestActive(dest.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            dest.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {dest.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS & GATEWAY AUDIT */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-base text-black flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#E50914]" />
                    <span>Payment Gateway & Webhook Audit</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Live/Sandbox Razorpay transaction logs, order references, HMAC signatures, and compensation refunds.
                  </p>
                </div>
              </div>

              {/* Payment Attempts */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 flex justify-between">
                  <span>Payment Attempts ({paymentAttempts.length})</span>
                  <span className="text-[11px] text-gray-400 font-normal">All amounts in INR</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {paymentAttempts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      No payment attempts recorded yet. Place a booking to generate a Razorpay order.
                    </div>
                  ) : (
                    paymentAttempts.map((attempt) => (
                      <div key={attempt.id} className="p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-black">{attempt.orderId}</span>
                            {attempt.paymentMethod && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-sans font-bold flex items-center gap-1">
                                {attempt.isPrototype && <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />}
                                <span>{PROTOTYPE_PAYMENT_CONFIG[attempt.paymentMethod]?.label || attempt.paymentMethod}</span>
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            attempt.status === 'CAPTURED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : attempt.status === 'REFUNDED'
                              ? 'bg-amber-100 text-amber-800'
                              : attempt.status === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {attempt.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600 text-[11px]">
                          <span>{attempt.serviceName} ({attempt.bookingReference})</span>
                          <span className="font-bold text-black">{formatINR(attempt.amountINR)}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Payer: {attempt.userEmail} • Payment ID: {attempt.razorpayPaymentId || 'N/A'} {attempt.refundId ? `• Refund: ${attempt.refundId}` : ''}
                        </div>
                        {attempt.failureReason && (
                          <div className="text-[11px] text-red-600 bg-red-50 p-1.5 rounded">
                            {attempt.failureReason}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LISTINGS & VERIFICATION TOGGLE */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              {/* Hotels Management */}
              <div>
                <h4 className="font-heading font-extrabold text-base text-black mb-2 flex items-center justify-between">
                  <span>Hotels Directory</span>
                  <span className="text-xs font-normal text-gray-500">Toggle verification badge</span>
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-black flex items-center gap-2">
                          <span>{hotel.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            hotel.sourceType === 'ADMIN_MANAGED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {hotel.sourceType}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {hotel.city} • {hotel.distanceFromStationKm} km from station • {formatINR(hotel.startingPriceINR)}/night
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleHotelVerification(hotel.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            hotel.verified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}
                        >
                          {hotel.verified ? <Check className="w-3 h-3 text-emerald-700" /> : <X className="w-3 h-3" />}
                          <span>{hotel.verified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurants Management */}
              <div>
                <h4 className="font-heading font-extrabold text-base text-black mb-2 flex items-center justify-between">
                  <span>Restaurants Directory</span>
                  <span className="text-xs font-normal text-gray-500">Toggle verification badge</span>
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {restaurants.map((rest) => (
                    <div key={rest.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-black flex items-center gap-2">
                          <span>{rest.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            rest.sourceType === 'ADMIN_MANAGED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rest.sourceType}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {rest.city} • {rest.cuisine.join(', ')} • {formatINR(rest.costForTwoINR)} for two
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleRestVerification(rest.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          rest.verified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {rest.verified ? <Check className="w-3 h-3 text-emerald-700" /> : <X className="w-3 h-3" />}
                        <span>{rest.verified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADD DESTINATION FORM */}
          {activeTab === 'new_destination' && (
            <form onSubmit={handleCreateDestination} className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="font-heading font-extrabold text-base text-black mb-1">
                Register New Travel Destination Hub
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="e.g. Udaipur"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={destState}
                    onChange={(e) => setDestState(e.target.value)}
                    placeholder="e.g. Rajasthan"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Destination Category</label>
                  <select
                    value={destType}
                    onChange={(e) => setDestType(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  >
                    <option value="HERITAGE">Heritage & Palaces</option>
                    <option value="HILL_STATION">Hill Station & Valleys</option>
                    <option value="BEACH">Coastal & Beach Gateways</option>
                    <option value="SPIRITUAL">Spiritual & Temples</option>
                    <option value="METRO">Metropolitan Hub</option>
                    <option value="CITY">Commercial City Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Popular For (Highlights)</label>
                  <input
                    type="text"
                    value={destPopular}
                    onChange={(e) => setDestPopular(e.target.value)}
                    placeholder="e.g. Lake Pichola, City Palace"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Central Bus Stand</label>
                  <input
                    type="text"
                    value={destBusStation}
                    onChange={(e) => setDestBusStation(e.target.value)}
                    placeholder="e.g. Udiapole Bus Terminal"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Central Railway Station</label>
                  <input
                    type="text"
                    value={destRailStation}
                    onChange={(e) => setDestRailStation(e.target.value)}
                    placeholder="e.g. Udaipur City (UDZ)"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Save Admin-Managed Destination
                </button>
              </div>
            </form>
          )}

          {/* TAB: ADD HOTEL FORM */}
          {activeTab === 'new_hotel' && (
            <form onSubmit={handleCreateHotel} className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="font-heading font-extrabold text-base text-black mb-1">
                Add Admin-Managed Hotel Property
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    required
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    placeholder="e.g. The Royal Grand Residency"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City Hub</label>
                  <select
                    value={hotelCity}
                    onChange={(e) => setHotelCity(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    placeholder="e.g. Near Station Road, Station Circle"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Starting Price / Night (INR ₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={hotelPrice}
                    onChange={(e) => setHotelPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Distance to Station (km)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={hotelDist}
                    onChange={(e) => setHotelDist(Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Create Verified Hotel Listing
                </button>
              </div>
            </form>
          )}

          {/* TAB: AUDIT TRAIL LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 flex justify-between items-center">
                <span>Administrative Audit Records</span>
                <span className="text-[11px] text-gray-500">Immutable chronological log</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#E50914]">{log.action}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-gray-800 font-medium">{log.details}</div>
                    <div className="text-[11px] text-gray-500">
                      Operator: <span className="font-mono">{log.userEmail}</span> • Entity: {log.entityType} ({log.entityId})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
};
