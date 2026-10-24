import React, { useState, useRef, useEffect } from 'react';
import { Bus, Train, Hotel as HotelIcon, Utensils, Search, Calendar, Users, MapPin, ArrowRightLeft, Sparkles, ChevronDown, Check } from 'lucide-react';
import { Destination, DestinationType, ServiceType } from '../lib/types';
import { getAutocompleteSuggestions } from '../lib/destinationQuery';

interface SearchHeroProps {
  destinations: Destination[];
  onSearch: (params: {
    serviceType: ServiceType;
    origin?: string;
    destinationCity: string;
    date?: string;
    returnDate?: string;
    passengersOrGuests?: number;
    timeSlot?: string;
  }) => void;
  activeService: ServiceType;
  setActiveService: (service: ServiceType) => void;
  onSelectDestinationChip: (cityName: string) => void;
  selectedDestinationName?: string;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  destinations,
  onSearch,
  activeService,
  setActiveService,
  onSelectDestinationChip,
  selectedDestinationName = 'Jaipur',
}) => {
  const [origin, setOrigin] = useState('New Delhi');
  const [destinationCity, setDestinationCity] = useState(selectedDestinationName);
  const [date, setDate] = useState('2026-11-15');
  const [returnDate, setReturnDate] = useState('2026-11-18');
  const [count, setCount] = useState(2);
  const [timeSlot, setTimeSlot] = useState('8:00 PM');

  // Autocomplete state
  const [originQuery, setOriginQuery] = useState('New Delhi');
  const [destQuery, setDestQuery] = useState(selectedDestinationName);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Sync destinationCity when selectedDestinationName prop changes
  useEffect(() => {
    if (selectedDestinationName) {
      setDestinationCity(selectedDestinationName);
      setDestQuery(selectedDestinationName);
    }
  }, [selectedDestinationName]);

  const originSuggestions = getAutocompleteSuggestions(destinations, originQuery, 6);
  const destSuggestions = getAutocompleteSuggestions(destinations, destQuery, 6);

  // Derive top featured destinations dynamically from active database records
  const featuredDestinations = destinations
    .filter((d) => d.isActive)
    .slice(0, 8);

  const handleSwap = () => {
    const tempOrig = origin;
    const tempQuery = originQuery;
    setOrigin(destinationCity);
    setOriginQuery(destQuery);
    setDestinationCity(tempOrig);
    setDestQuery(tempQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      serviceType: activeService,
      origin: activeService === 'BUS' || activeService === 'TRAIN' ? origin : undefined,
      destinationCity,
      date,
      returnDate: activeService === 'HOTEL' ? returnDate : undefined,
      passengersOrGuests: count,
      timeSlot: activeService === 'RESTAURANT' ? timeSlot : undefined,
    });
  };

  const getTypeBadgeColor = (type: DestinationType) => {
    switch (type) {
      case 'HILL_STATION':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'BEACH':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'HERITAGE':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'SPIRITUAL':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'METRO':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="relative bg-[#111111] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#222222] overflow-visible">
      {/* Background architectural glow & subtle pattern */}
      <div className="absolute inset-0 bg-radial-at-c from-[#B20710]/15 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C] border border-gray-700 text-xs font-semibold text-gray-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
            <span>Zero Bundle Mandates • Database-Driven Pan-India Travel</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-white mb-3">
            Travel on Your Terms with <span className="text-[#E50914]">Trip Flex</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Search intercity buses, Indian Railways timetables, verified stays, and curated dining across {destinations.length}+ Indian cities and hill stations.
          </p>
        </div>

        {/* Tabbed Search Box Container */}
        <div className="bg-[#1C1C1C] rounded-2xl border border-gray-700 shadow-2xl p-4 sm:p-6">
          {/* Service Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-800">
            <button
              type="button"
              onClick={() => setActiveService('BUS')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeService === 'BUS'
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/30'
                  : 'bg-[#111111] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Bus Travel</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveService('TRAIN')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeService === 'TRAIN'
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/30'
                  : 'bg-[#111111] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Train className="w-4 h-4" />
              <span>Train Journey</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveService('HOTEL')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeService === 'HOTEL'
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/30'
                  : 'bg-[#111111] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <HotelIcon className="w-4 h-4" />
              <span>Hotels & Stays</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveService('RESTAURANT')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeService === 'RESTAURANT'
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/30'
                  : 'bg-[#111111] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Table Reservation</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Origin (for Bus/Train) */}
              {(activeService === 'BUS' || activeService === 'TRAIN') && (
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    From Station / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#E50914]" />
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => {
                        setOriginQuery(e.target.value);
                        setOrigin(e.target.value);
                        setShowOriginSuggestions(true);
                      }}
                      onFocus={() => setShowOriginSuggestions(true)}
                      placeholder="Type city or station..."
                      className="w-full bg-[#111111] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showOriginSuggestions && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-800 max-h-60 overflow-y-auto">
                      {originSuggestions.length === 0 ? (
                        <div className="p-3 text-xs text-gray-400 text-center">
                          No matching destination in database
                        </div>
                      ) : (
                        originSuggestions.map((item) => (
                          <div
                            key={item.id}
                            onMouseDown={() => {
                              setOrigin(item.name);
                              setOriginQuery(item.name);
                              setShowOriginSuggestions(false);
                            }}
                            className="p-2.5 hover:bg-[#252525] cursor-pointer transition flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="text-gray-400 text-[11px] ml-1.5">{item.state}</span>
                            </div>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${getTypeBadgeColor(item.destinationType)}`}>
                              {item.destinationType}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Destination City / Hub (Database Autocomplete) */}
              <div className={`${activeService === 'HOTEL' || activeService === 'RESTAURANT' ? 'sm:col-span-2' : ''} relative`}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  To Destination / City Hub
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#E50914]" />
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => {
                      setDestQuery(e.target.value);
                      setDestinationCity(e.target.value);
                      setShowDestSuggestions(true);
                    }}
                    onFocus={() => setShowDestSuggestions(true)}
                    placeholder="Search any destination in India..."
                    className="w-full bg-[#111111] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showDestSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-800 max-h-60 overflow-y-auto">
                    {destSuggestions.length === 0 ? (
                      <div className="p-3 text-xs text-gray-400 text-center">
                        No matching destinations found. Try another city or state name.
                      </div>
                    ) : (
                      destSuggestions.map((item) => (
                        <div
                          key={item.id}
                          onMouseDown={() => {
                            setDestinationCity(item.name);
                            setDestQuery(item.name);
                            setShowDestSuggestions(false);
                            onSelectDestinationChip(item.name);
                          }}
                          className="p-2.5 hover:bg-[#252525] cursor-pointer transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-white">{item.name}</span>
                            <span className="text-gray-400 text-[11px] ml-1.5">{item.state}</span>
                            <div className="text-[10px] text-gray-500 truncate max-w-xs">{item.popularFor}</div>
                          </div>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${getTypeBadgeColor(item.destinationType)}`}>
                            {item.destinationType}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {activeService === 'HOTEL' ? 'Check-In Date' : 'Travel / Dining Date'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#E50914]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#111111] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                  />
                </div>
              </div>

              {/* Secondary selector: Return Date (Hotel) / Time Slot (Restaurant) / Passengers */}
              {activeService === 'HOTEL' ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Check-Out Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#E50914]" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-[#111111] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                    />
                  </div>
                </div>
              ) : activeService === 'RESTAURANT' ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Reservation Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#111111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                  >
                    <option value="12:30 PM">Lunch: 12:30 PM</option>
                    <option value="1:30 PM">Lunch: 1:30 PM</option>
                    <option value="7:30 PM">Dinner: 7:30 PM</option>
                    <option value="8:00 PM">Dinner: 8:00 PM</option>
                    <option value="8:30 PM">Dinner: 8:30 PM</option>
                    <option value="9:30 PM">Dinner: 9:30 PM</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Travellers / Seats
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-3 text-[#E50914]" />
                    <select
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full bg-[#111111] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition"
                    >
                      <option value={1}>1 Traveller</option>
                      <option value={2}>2 Travellers</option>
                      <option value={3}>3 Travellers</option>
                      <option value={4}>4 Travellers</option>
                      <option value={5}>5+ Group Booking</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row: Database-Driven Featured Hub Chips */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Featured Hubs ({featuredDestinations.length}):</span>
                {featuredDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setDestinationCity(dest.name);
                      setDestQuery(dest.name);
                      onSelectDestinationChip(dest.name);
                    }}
                    className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer transition ${
                      destinationCity.toLowerCase() === dest.name.toLowerCase()
                        ? 'border-[#E50914] text-white bg-red-950/50 font-semibold'
                        : 'border-gray-700 hover:border-gray-500 text-gray-300 bg-[#111111]'
                    }`}
                  >
                    <span>{dest.name}</span>
                    <span className="text-[10px] text-gray-400 ml-1">({dest.state})</span>
                  </button>
                ))}
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition transform active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search {activeService === 'BUS' ? 'Buses' : activeService === 'TRAIN' ? 'Trains' : activeService === 'HOTEL' ? 'Hotels' : 'Dining'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
