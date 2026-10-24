import React from 'react';
import { X, Ticket, Calendar, MapPin, AlertCircle, Clock, Trash2, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { Booking } from '../lib/types';
import { formatINR } from '../lib/pricing';
import { PROTOTYPE_PAYMENT_CONFIG } from '../lib/payments';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#E50914]" />
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                My Bookings & Reservations
              </h3>
              <p className="text-[11px] text-gray-400">
                Independent records across buses, stays, and tables
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-[#F7F7F7]">
          {bookings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-gray-400 mb-3">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-700 text-sm mb-1">No bookings yet</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore buses, train schedules, hotels, or restaurants and complete your first independent booking.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow transition"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {booking.serviceType}
                    </span>
                    <div className="font-heading font-bold text-sm text-black mt-1">
                      {booking.serviceName}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded inline-block ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <div className="text-[11px] font-mono text-gray-400 mt-1">
                      {booking.bookingReference}
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  {booking.serviceDetails.origin && booking.serviceDetails.destination && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{booking.serviceDetails.origin} → {booking.serviceDetails.destination}</span>
                    </div>
                  )}

                  {booking.serviceDetails.travelDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Date: {booking.serviceDetails.travelDate} ({booking.serviceDetails.travelTime || 'Standard'})</span>
                    </div>
                  )}

                  {booking.serviceDetails.seatNumbers && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Seats:</span>
                      <strong className="text-black">{booking.serviceDetails.seatNumbers.join(', ')}</strong>
                    </div>
                  )}

                  {booking.serviceDetails.checkInDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Stay: {booking.serviceDetails.checkInDate} to {booking.serviceDetails.checkOutDate} ({booking.serviceDetails.nights} nights)</span>
                    </div>
                  )}

                  {booking.serviceDetails.reservationTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Dining Slot: {booking.serviceDetails.reservationTime} ({booking.serviceDetails.partySize} Guests)</span>
                    </div>
                  )}

                  {/* Payment Metadata Row */}
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-mono space-y-1 mt-2">
                    {booking.paymentMethod && (
                      <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                        <span className="text-gray-500 font-sans">Payment Method:</span>
                        <span className="font-bold text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-sans flex items-center gap-1">
                          {booking.isPrototype && <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />}
                          <span>{PROTOTYPE_PAYMENT_CONFIG[booking.paymentMethod]?.label || booking.paymentMethod}</span>
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Gateway Order:</span>
                      <span className="font-bold text-black">{booking.paymentOrderId || 'order_pre_auth'}</span>
                    </div>
                    {booking.paymentId && (
                      <div className="flex justify-between text-emerald-800">
                        <span>Payment Ref:</span>
                        <span className="font-bold">{booking.paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className="font-bold text-emerald-700">{booking.paymentStatus || 'CAPTURED'}</span>
                    </div>
                    {booking.notes && (
                      <div className="text-[10px] text-gray-500 font-sans italic pt-0.5 border-t border-gray-200">
                        {booking.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Cancellation Action */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Total Fare</span>
                    <span className="font-extrabold text-sm text-black">
                      {formatINR(booking.priceBreakdown.totalAmount)}
                    </span>
                  </div>

                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel booking ${booking.bookingReference}?`)) {
                          onCancelBooking(booking.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};
