import test from 'node:test';
import assert from 'node:assert/strict';
import { queryDestinations, getAutocompleteSuggestions, getAvailableStates } from './destinationQuery';
import { importIndianDestinations, INDIAN_GEOGRAPHIC_DATASET } from './destinationsData';
import { Destination } from './types';

test('importIndianDestinations performs repeatable, idempotent import without duplicates', () => {
  const initial: Destination[] = [
    {
      id: 'dest-jaipur',
      name: 'Jaipur Custom',
      state: 'Rajasthan',
      country: 'India',
      destinationType: 'HERITAGE',
      popularFor: 'Amer',
      tagline: 'Custom Tagline',
      imageUrl: '',
      coordinates: { lat: 26.9, lng: 75.7 },
      majorHubs: { busStations: ['Old Stand'], railwayStations: ['JP'] },
      isActive: true,
      sourceType: 'ADMIN_MANAGED',
    },
  ];

  // First import
  const result1 = importIndianDestinations(initial);
  assert.equal(result1.merged.length, INDIAN_GEOGRAPHIC_DATASET.length);
  assert.equal(result1.addedCount, INDIAN_GEOGRAPHIC_DATASET.length - 1);
  assert.equal(result1.updatedCount, 1);

  // Second repeatable import on the same set
  const result2 = importIndianDestinations(result1.merged);
  assert.equal(result2.merged.length, INDIAN_GEOGRAPHIC_DATASET.length);
  assert.equal(result2.addedCount, 0, 'No duplicates should be added on repeat import');
  assert.equal(result2.updatedCount, INDIAN_GEOGRAPHIC_DATASET.length);
});

test('queryDestinations performs case-insensitive partial search and pagination', () => {
  const destinations = INDIAN_GEOGRAPHIC_DATASET;

  // Search "raj" -> should match Jaipur, Udaipur, Jodhpur, Jaisalmer in Rajasthan
  const searchResult = queryDestinations(destinations, {
    query: 'raj',
    pageSize: 3,
    page: 1,
  });

  assert.ok(searchResult.totalCount >= 4, `Expected >= 4 matches for 'raj', got ${searchResult.totalCount}`);
  assert.equal(searchResult.items.length, 3, 'Should respect pageSize limit');
  assert.equal(searchResult.page, 1);
  assert.equal(searchResult.hasMore, true);
  assert.ok(searchResult.totalPages >= 2);
});

test('queryDestinations filters by state and destination type', () => {
  const destinations = INDIAN_GEOGRAPHIC_DATASET;

  // Filter only Kerala
  const keralaResult = queryDestinations(destinations, {
    state: 'Kerala',
    pageSize: 20,
  });
  assert.ok(keralaResult.items.length >= 3, 'Expected Kochi, Munnar, Alleppey');
  assert.ok(keralaResult.items.every((d) => d.state === 'Kerala'));

  // Filter HILL_STATION type
  const hillStations = queryDestinations(destinations, {
    destinationType: 'HILL_STATION',
    pageSize: 30,
  });
  assert.ok(hillStations.items.length >= 5, 'Expected Manali, Shimla, Ooty, Munnar, etc.');
  assert.ok(hillStations.items.every((d) => d.destinationType === 'HILL_STATION'));
});

test('getAutocompleteSuggestions returns fast top matches', () => {
  const suggestions = getAutocompleteSuggestions(INDIAN_GEOGRAPHIC_DATASET, 'goa', 3);
  assert.ok(suggestions.length > 0);
  assert.equal(suggestions[0].name, 'Goa');
});

test('getAvailableStates lists unique states', () => {
  const states = getAvailableStates(INDIAN_GEOGRAPHIC_DATASET);
  assert.ok(states.includes('Rajasthan'));
  assert.ok(states.includes('Kerala'));
  assert.ok(states.includes('Himachal Pradesh'));
  assert.ok(states.includes('Maharashtra'));
});

test('INDIAN_GEOGRAPHIC_DATASET comprehensively covers all 28 Indian States and 8 Union Territories', () => {
  const all28States = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const all8UTs = [
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const availableStates = getAvailableStates(INDIAN_GEOGRAPHIC_DATASET);

  // Assert every single state is represented
  for (const st of all28States) {
    assert.ok(availableStates.includes(st), `Missing Indian State: ${st}`);
  }

  // Assert every single Union Territory is represented
  for (const ut of all8UTs) {
    assert.ok(availableStates.includes(ut), `Missing Union Territory: ${ut}`);
  }

  assert.equal(availableStates.length, 36, 'Expected exactly 36 States and Union Territories');

  // Verify all destinations have valid coordinates and non-empty transit hubs
  for (const dest of INDIAN_GEOGRAPHIC_DATASET) {
    assert.ok(dest.name.length > 0, `Destination ${dest.id} has invalid name`);
    assert.ok(dest.coordinates.lat >= 8 && dest.coordinates.lat <= 38, `Destination ${dest.name} latitude out of bounds`);
    assert.ok(dest.coordinates.lng >= 68 && dest.coordinates.lng <= 98, `Destination ${dest.name} longitude out of bounds`);
    assert.ok(dest.majorHubs.busStations.length > 0, `Destination ${dest.name} must have bus hub`);
    assert.ok(dest.majorHubs.railwayStations.length > 0, `Destination ${dest.name} must have rail hub`);
  }
});

