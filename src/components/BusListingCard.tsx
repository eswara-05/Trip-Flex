import React from 'react';
import { Bus, Clock, MapPin, ShieldCheck, Star, Award, Wifi, Zap } from 'lucide-react';
import { BusService } from '../lib/types';
import { formatINR } from '../lib/pricing';

interface BusListingCardProps {
  bus: BusService;
  onBook: (bus: BusService) => void;
}

export const BusListingCard: React.FC<BusListingCardProps> = ({ bus, onBook }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-all shadow-sm hover:shadow-md p-5 flex flex-col justify-between">
      <div>
        {/* Top Badges & Operator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading font-bold text-lg text-black">{bus.operatorName}</span>
              {bus.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Fleet
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              <span>{bus.busType}</span> • <span className="text-gray-400 font-mono text-[11px]">{bus.busNumber}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-[#111111] text-white px-2.5 py-1 rounded-lg text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{bus.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-[10px]">({bus.reviewsCount})</span>
          </div>
        </div>

        {/* Schedule & Timing Route */}
        <div className="grid grid-cols-3 items-center py-3 my-2 border-y border-gray-100 bg-[#F7F7F7]/60 rounded-lg px-3">
          <div>
            <div className="text-lg font-extrabold text-black font-heading">{bus.departureTime}</div>
            <div className="text-xs font-semibold text-gray-700 truncate">{bus.originCity}</div>
            <div className="text-[11px] text-gray-500 truncate">{bus.originStation}</div>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-bold text-gray-400 block">{bus.duration}</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="h-[2px] w-full bg-gray-300 relative flex items-center justify-center">
                <Bus className="w-3.5 h-3.5 text-[#E50914] bg-[#F7F7F7] px-0.5" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">{bus.availableSeats} seats left</span>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-black font-heading">{bus.arrivalTime}</div>
            <div className="text-xs font-semibold text-gray-700 truncate">{bus.destinationCity}</div>
            <div className="text-[11px] text-gray-500 truncate">{bus.destinationStation}</div>
          </div>
        </div>

        {/* Amenities chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {bus.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium"
            >
              {amenity}
            </span>
          ))}
          {bus.amenities.length > 3 && (
            <span className="text-[10px] text-gray-400 px-1 py-0.5">
              +{bus.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Pricing & Action */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-500 font-medium">Fare starts at</div>
          <div className="text-xl font-extrabold text-[#E50914] font-heading">
            {formatINR(bus.baseFareINR)}
            <span className="text-xs text-gray-500 font-normal"> / seat</span>
          </div>
        </div>

        <button
          onClick={() => onBook(bus)}
          className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow hover:shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Select Seats & Book</span>
        </button>
      </div>
    </div>
  );
};
