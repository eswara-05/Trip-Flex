import React, { useState } from 'react';
import { MapPin, Bus, Train, Hotel as HotelIcon, Utensils, Star, Compass, Filter, ArrowRight, ShieldCheck } from 'lucide-react';
import { Destination, Hotel, Restaurant } from '../lib/types';
import { findNearbyHotels, findNearbyRestaurants } from '../lib/geo';
import { HotelListingCard } from './HotelListingCard';
import { RestaurantListingCard } from './RestaurantListingCard';

interface DestinationHubProps {
  destination: Destination;
  allHotels: Hotel[];
  allRestaurants: Restaurant[];
  onBookHotel: (hotel: Hotel) => void;
  onBookRestaurant: (restaurant: Restaurant, slot: string) => void;
  onClose?: () => void;
}

export const DestinationHub: React.FC<DestinationHubProps> = ({
  destination,
  allHotels,
  allRestaurants,
  onBookHotel,
  onBookRestaurant,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hotels' | 'restaurants'>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);

  // Calculate nearby hotels and restaurants using Haversine formula relative to destination center / transit hubs
  const cityHotels = allHotels.filter(
    (h) => h.city.toLowerCase() === destination.name.toLowerCase()
  );
  const cityRestaurants = allRestaurants.filter(
    (r) => r.city.toLowerCase() === destination.name.toLowerCase()
  );

  const nearbyHotels = findNearbyHotels(destination.coordinates, cityHotels, maxDistanceKm);
  const nearbyRestaurants = findNearbyRestaurants(destination.coordinates, cityRestaurants, maxDistanceKm);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg mb-8">
      {/* Destination Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-gray-900 overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Destination Discovery
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-gray-600">
              {destination.state}, {destination.country}
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-black/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full border border-gray-600 cursor-pointer transition"
            >
              ✕ Close Explorer
            </button>
          )}
        </div>

        {/* Destination Title & Highlights */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight mb-1">
            {destination.name}
          </h2>
          <p className="text-sm text-gray-200 max-w-2xl mb-3 leading-relaxed">
            {destination.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium text-white">
              ⭐ Famous For: {destination.popularFor}
            </span>
          </div>
        </div>
      </div>

      {/* Transit Arrival Stations Bar */}
      <div className="bg-[#1C1C1C] text-white p-4 sm:p-5 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#E50914]" />
              Major Transit Arrival Hubs in {destination.name}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-[#111111] px-2.5 py-1 rounded-md border border-gray-700">
                <Bus className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Bus: <strong>{destination.majorHubs.busStations.join(' • ')}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111111] px-2.5 py-1 rounded-md border border-gray-700">
                <Train className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Rail: <strong>{destination.majorHubs.railwayStations.join(' • ')}</strong></span>
              </div>
            </div>
          </div>

          {/* Proximity Filter */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#111111] p-1.5 rounded-lg border border-gray-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <span className="text-gray-400">Transit Radius:</span>
            {[5, 10, 20].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setMaxDistanceKm(km)}
                className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                  maxDistanceKm === km
                    ? 'bg-[#E50914] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ≤ {km} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery Navigation Sub-tabs */}
      <div className="p-4 sm:p-6 bg-[#F7F7F7] border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
              }`}
            >
              All Nearby ({nearbyHotels.length + nearbyRestaurants.length})
            </button>
            <button
              onClick={() => setActiveCategory('hotels')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'hotels'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
              }`}
            >
              <HotelIcon className="w-3.5 h-3.5" />
              Hotels ({nearbyHotels.length})
            </button>
            <button
              onClick={() => setActiveCategory('restaurants')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'restaurants'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              Restaurants ({nearbyRestaurants.length})
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing verified stays & dining within {maxDistanceKm} km of transit stations
          </div>
        </div>
      </div>

      {/* Listings Body */}
      <div className="p-4 sm:p-6 space-y-8">
        {/* Hotels Section */}
        {(activeCategory === 'all' || activeCategory === 'hotels') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-black flex items-center gap-2">
                  <HotelIcon className="w-5 h-5 text-[#E50914]" />
                  Nearby Hotels & Stays in {destination.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Reliable distance and availability calculated relative to central transit
                </p>
              </div>
            </div>

            {nearbyHotels.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No hotels found within {maxDistanceKm} km radius. Try expanding the transit radius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearbyHotels.map((hotel) => (
                  <HotelListingCard
                    key={hotel.id}
                    hotel={hotel}
                    onBook={onBookHotel}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Restaurants Section */}
        {(activeCategory === 'all' || activeCategory === 'restaurants') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-black flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#E50914]" />
                  Nearby Dining & Restaurants in {destination.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Authentic local cuisine, opening hours, and table slot availability
                </p>
              </div>
            </div>

            {nearbyRestaurants.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No restaurants found within {maxDistanceKm} km radius. Try expanding the transit radius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {nearbyRestaurants.map((rest) => (
                  <RestaurantListingCard
                    key={rest.id}
                    restaurant={rest}
                    onBook={onBookRestaurant}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
