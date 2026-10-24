import React from 'react';
import { Hotel as HotelIcon, Star, MapPin, ShieldCheck, Check, BedDouble, Wifi, Coffee, ExternalLink } from 'lucide-react';
import { Hotel } from '../lib/types';
import { formatINR } from '../lib/pricing';

interface HotelListingCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
  onViewNearbyDining?: (hotel: Hotel) => void;
}

export const HotelListingCard: React.FC<HotelListingCardProps> = ({
  hotel,
  onBook,
  onViewNearbyDining,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image & Star Badges */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img
            src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {hotel.starRating}-Star Hotel
            </span>
            {hotel.sourceType === 'ADMIN_MANAGED' && (
              <span className="bg-emerald-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                Admin Verified
              </span>
            )}
            {hotel.sourceType === 'DEV_SAMPLE' && (
              <span className="bg-amber-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                Sample Data (Dev)
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <span>★ {hotel.guestRating.toFixed(1)}</span>
            <span className="text-gray-300 text-[10px]">({hotel.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <h3 className="font-heading font-extrabold text-lg text-black mb-1 line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
            <span className="truncate">{hotel.address}</span>
          </div>

          <div className="inline-block bg-[#F7F7F7] border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-3">
            📍 <strong className="text-black">{hotel.distanceFromStationKm} km</strong> from Central Station & Transit Hub
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
            {hotel.description}
          </p>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1 mb-2">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] text-gray-400 px-1 py-0.5">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Booking action */}
      <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium">Starting from</span>
          <div className="text-lg font-extrabold text-[#E50914] font-heading">
            {formatINR(hotel.startingPriceINR)}
            <span className="text-[11px] text-gray-500 font-normal"> / night</span>
          </div>
        </div>

        <button
          onClick={() => onBook(hotel)}
          className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow hover:shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <BedDouble className="w-3.5 h-3.5" />
          <span>Reserve Room</span>
        </button>
      </div>
    </div>
  );
};
