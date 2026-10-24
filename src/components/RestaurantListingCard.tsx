import React, { useState } from 'react';
import { Utensils, Star, MapPin, Clock, ShieldCheck, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Restaurant } from '../lib/types';
import { formatINR } from '../lib/pricing';

interface RestaurantListingCardProps {
  restaurant: Restaurant;
  onBook: (restaurant: Restaurant, selectedSlot: string) => void;
}

export const RestaurantListingCard: React.FC<RestaurantListingCardProps> = ({
  restaurant,
  onBook,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(restaurant.availableSlots[0] || '8:00 PM');
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img
            src={restaurant.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-bold">
              {restaurant.cuisine[0]}
            </span>
            {restaurant.sourceType === 'ADMIN_MANAGED' && (
              <span className="bg-emerald-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                Admin Verified
              </span>
            )}
            {restaurant.sourceType === 'DEV_SAMPLE' && (
              <span className="bg-amber-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                Sample Data (Dev)
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-gray-300 text-[10px]">({restaurant.reviewsCount})</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-heading font-extrabold text-lg text-black mb-1 line-clamp-1">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-700 bg-[#F7F7F7] border border-gray-200 px-2 py-1 rounded mb-3">
            <span>📍 <strong>{restaurant.distanceFromStationKm} km</strong> from transit hub</span>
            <span className="font-medium">🕒 {restaurant.openingHours}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.cuisine.map((c, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-red-50 text-[#B20710] font-semibold px-2 py-0.5 rounded border border-red-100"
              >
                {c}
              </span>
            ))}
            {restaurant.features.map((f, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Time Slot Selector */}
          <div className="mb-3">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              Select Dining Time Slot:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                const bookedCount = restaurant.currentBookedSlots[slot] || 0;
                const available = restaurant.maxCapacityPerSlot - bookedCount;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#E50914] text-white border-[#E50914]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span>{slot}</span>
                    <span className="text-[9px] opacity-75 ml-1">({available} left)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sample Menu Accordion */}
          {restaurant.sampleMenu && restaurant.sampleMenu.length > 0 && (
            <div className="border border-gray-100 rounded-lg p-2 bg-gray-50/50 mb-2">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <span>View Signature Menu Highlights</span>
                {showMenu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showMenu && (
                <div className="mt-2 space-y-1.5 pt-2 border-t border-gray-200">
                  {restaurant.sampleMenu[0].items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">{formatINR(item.priceINR)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Booking action */}
      <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium">Approx Cost for Two</span>
          <div className="text-lg font-extrabold text-black font-heading">
            {formatINR(restaurant.costForTwoINR)}
          </div>
        </div>

        <button
          onClick={() => onBook(restaurant, selectedSlot)}
          className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow hover:shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Reserve Table</span>
        </button>
      </div>
    </div>
  );
};
