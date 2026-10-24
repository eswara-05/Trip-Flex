/**
 * Scalable Destination Query, Filter, and Pagination Engine
 * Complies with requirement: Case-insensitive search, partial matching,
 * autocomplete suggestions, pagination, state/type filtering, and geographic proximity.
 */
import { Coordinates, Destination, DestinationType } from './types';
import { calculateDistanceKm } from './geo';

export interface DestinationQueryOptions {
  query?: string;
  state?: string;
  destinationType?: DestinationType | 'ALL';
  page?: number;
  pageSize?: number;
  onlyActive?: boolean;
  userCoordinates?: Coordinates;
  sortBy?: 'name' | 'state' | 'distance';
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface AutocompleteSuggestion {
  id: string;
  name: string;
  state: string;
  destinationType: DestinationType;
  popularFor: string;
}

/**
 * Searches and paginates destinations with multiple filter criteria
 */
export function queryDestinations(
  destinations: Destination[],
  options: DestinationQueryOptions = {}
): PaginatedResult<Destination> {
  const {
    query = '',
    state = 'ALL',
    destinationType = 'ALL',
    page = 1,
    pageSize = 9,
    onlyActive = true,
    userCoordinates,
    sortBy = 'name',
  } = options;

  const normalizedQuery = query.trim().toLowerCase();

  // 1. Filter
  let filtered = destinations.filter((dest) => {
    if (onlyActive && !dest.isActive) return false;

    // Filter by State
    if (state !== 'ALL' && dest.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }

    // Filter by Destination Type
    if (destinationType !== 'ALL' && dest.destinationType !== destinationType) {
      return false;
    }

    // Search query partial match across name, state, popularFor, tagline, transit hubs
    if (normalizedQuery) {
      const matchName = dest.name.toLowerCase().includes(normalizedQuery);
      const matchState = dest.state.toLowerCase().includes(normalizedQuery);
      const matchPopular = dest.popularFor.toLowerCase().includes(normalizedQuery);
      const matchTagline = dest.tagline.toLowerCase().includes(normalizedQuery);
      const matchBusHubs = dest.majorHubs.busStations.some((h) =>
        h.toLowerCase().includes(normalizedQuery)
      );
      const matchRailHubs = dest.majorHubs.railwayStations.some((h) =>
        h.toLowerCase().includes(normalizedQuery)
      );

      return (
        matchName || matchState || matchPopular || matchTagline || matchBusHubs || matchRailHubs
      );
    }

    return true;
  });

  // 2. Sort
  filtered = filtered.sort((a, b) => {
    if (sortBy === 'distance' && userCoordinates) {
      const distA = calculateDistanceKm(userCoordinates, a.coordinates);
      const distB = calculateDistanceKm(userCoordinates, b.coordinates);
      return distA - distB;
    }
    if (sortBy === 'state') {
      return a.state.localeCompare(b.state) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  // 3. Paginate
  const totalCount = filtered.length;
  const safePage = Math.max(1, page);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (safePage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
    hasMore: safePage < totalPages,
  };
}

/**
 * Fast autocomplete suggestions for search bars
 */
export function getAutocompleteSuggestions(
  destinations: Destination[],
  query: string,
  limit: number = 6
): AutocompleteSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return destinations
      .filter((d) => d.isActive)
      .slice(0, limit)
      .map((d) => ({
        id: d.id,
        name: d.name,
        state: d.state,
        destinationType: d.destinationType,
        popularFor: d.popularFor,
      }));
  }

  return destinations
    .filter((d) => {
      if (!d.isActive) return false;
      return (
        d.name.toLowerCase().includes(normalized) ||
        d.state.toLowerCase().includes(normalized) ||
        d.popularFor.toLowerCase().includes(normalized)
      );
    })
    .slice(0, limit)
    .map((d) => ({
      id: d.id,
      name: d.name,
      state: d.state,
      destinationType: d.destinationType,
      popularFor: d.popularFor,
    }));
}

/**
 * Returns unique sorted list of states currently in the destination dataset
 */
export function getAvailableStates(destinations: Destination[]): string[] {
  const set = new Set<string>();
  destinations.forEach((d) => {
    if (d.state) set.add(d.state);
  });
  return Array.from(set).sort();
}
