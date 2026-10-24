import React, { useState, useMemo } from 'react';
import { Destination, DestinationType } from '../lib/types';
import { queryDestinations, getAvailableStates } from '../lib/destinationQuery';
import { MapPin, Search, Filter, Compass, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Building, Mountain, Trees, Palmtree, Landmark } from 'lucide-react';

interface DestinationDirectoryProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  selectedCityName?: string;
}

export const DestinationDirectory: React.FC<DestinationDirectoryProps> = ({
  destinations,
  onSelectDestination,
  selectedCityName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<DestinationType | 'ALL'>('ALL');
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  const states = useMemo(() => getAvailableStates(destinations), [destinations]);

  // Execute query using our decoupled query engine
  const paginatedResult = useMemo(() => {
    return queryDestinations(destinations, {
      query: searchQuery,
      state: selectedState,
      destinationType: selectedType,
      page,
      pageSize,
      onlyActive: true,
      sortBy: 'name',
    });
  }, [destinations, searchQuery, selectedState, selectedType, page]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setSelectedType('ALL');
    setPage(1);
  };

  const getTypeIcon = (type: DestinationType) => {
    switch (type) {
      case 'HILL_STATION':
        return <Mountain className="w-3.5 h-3.5 text-emerald-600" />;
      case 'BEACH':
      case 'ISLAND':
        return <Palmtree className="w-3.5 h-3.5 text-cyan-600" />;
      case 'HERITAGE':
        return <Landmark className="w-3.5 h-3.5 text-amber-600" />;
      case 'SPIRITUAL':
        return <Sparkles className="w-3.5 h-3.5 text-orange-600" />;
      case 'METRO':
        return <Building className="w-3.5 h-3.5 text-blue-600" />;
      case 'WILDLIFE':
      case 'NATURE':
        return <Trees className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-12">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-black flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#E50914]" />
            <span>Pan-India Destination Directory</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Database-backed geographic discovery across <strong className="text-black">{destinations.length} destinations</strong> in <strong className="text-black">{states.length} Indian States & UTs</strong>.
          </p>
        </div>

        {/* Live Filter Counter */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
            {paginatedResult.totalCount} matching destination{paginatedResult.totalCount === 1 ? '' : 's'}
          </span>
          {(searchQuery || selectedState !== 'ALL' || selectedType !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#E50914] hover:underline font-bold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-[#F7F7F7] p-3.5 rounded-xl border border-gray-200">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by city, fort, or station..."
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
          />
        </div>

        {/* State Filter */}
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
          >
            <option value="ALL">All States & Union Territories ({states.length})</option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Category Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as any);
              setPage(1);
            }}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
          >
            <option value="ALL">All Destination Types</option>
            <option value="HILL_STATION">Hill Stations & Valleys</option>
            <option value="HERITAGE">Heritage & Palaces</option>
            <option value="BEACH">Coastal & Beach Gateways</option>
            <option value="SPIRITUAL">Spiritual & Temples</option>
            <option value="METRO">Metropolitan Hubs</option>
            <option value="CITY">Cities & Commercial Hubs</option>
            <option value="WILDLIFE">Wildlife Sanctuaries</option>
            <option value="NATURE">Nature & Waterfalls</option>
            <option value="ISLAND">Tropical Islands & Atolls</option>
          </select>
        </div>
      </div>

      {/* Grid of Destination Cards */}
      {paginatedResult.items.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 my-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-2">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-700 text-sm">No destinations found matching your filter</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-3">
            No records matched "{searchQuery || selectedState}". You can reset your search or use the Admin Portal to import additional regions.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-lg shadow hover:bg-[#B20710] transition cursor-pointer"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedResult.items.map((dest) => {
            const isSelected = selectedCityName?.toLowerCase() === dest.name.toLowerCase();

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className={`group bg-white rounded-xl border transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected ? 'border-[#E50914] ring-2 ring-red-500/20' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Photo & Badges */}
                <div className="relative h-44 bg-gray-900 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-white/20">
                      {getTypeIcon(dest.destinationType)}
                      <span>{dest.destinationType.replace('_', ' ')}</span>
                    </span>
                    {dest.isVerified && (
                      <span className="bg-emerald-700/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
                      {dest.state}
                    </span>
                    <h3 className="font-heading font-extrabold text-xl text-white truncate">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2.5">
                    {dest.tagline}
                  </p>
                  <div className="text-[11px] text-gray-700 font-medium mb-2">
                    ⭐ <strong>Key Highlights:</strong> {dest.popularFor}
                  </div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                    <Compass className="w-3 h-3 text-[#E50914] shrink-0" />
                    <span>Station: {dest.majorHubs.railwayStations[0]}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="p-3.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E50914] group-hover:text-[#B20710] bg-gray-50/50">
                  <span>Explore Arrival Hub & Nearby Stays</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {paginatedResult.totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            Showing <strong className="text-black">{(page - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-black">{Math.min(page * pageSize, paginatedResult.totalCount)}</strong> of{' '}
            <strong className="text-black">{paginatedResult.totalCount}</strong> destinations
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`p-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition ${
                page <= 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="px-3 py-1 font-semibold text-gray-800">
              Page {page} of {paginatedResult.totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(paginatedResult.totalPages, p + 1))}
              disabled={!paginatedResult.hasMore}
              className={`p-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition ${
                !paginatedResult.hasMore
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
