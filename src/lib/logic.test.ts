import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm, findNearbyHotels, findNearbyRestaurants } from './geo';
import { calculatePriceBreakdown, formatINR } from './pricing';
import { isValidStatusTransition, validateHotelDates, validateEmail, validateIndianPhone, generateBookingReference } from './validators';
import { Hotel, Restaurant } from './types';

test('calculateDistanceKm calculates accurate Haversine distance between cities', () => {
  // New Delhi to Jaipur is approx 238-242 km direct
  const delhi = { lat: 28.6139, lng: 77.2090 };
  const jaipur = { lat: 26.9124, lng: 75.7873 };
  const dist = calculateDistanceKm(delhi, jaipur);
  
  assert.ok(dist >= 235 && dist <= 245, `Expected ~240km, got ${dist}`);
});

test('calculateDistanceKm returns 0 for identical coordinates', () => {
  const pt = { lat: 18.5204, lng: 73.8567 };
  assert.equal(calculateDistanceKm(pt, pt), 0);
});

test('findNearbyHotels filters and sorts by proximity', () => {
  const center = { lat: 26.9124, lng: 75.7873 }; // Jaipur center
  const sampleHotels: Hotel[] = [
    {
      id: 'h1',
      name: 'Far Hotel',
      city: 'Jaipur',
      address: 'Outskirts',
      coordinates: { lat: 27.5000, lng: 76.5000 },
      distanceFromStationKm: 80,
      starRating: 4,
      guestRating: 4.5,
      reviewsCount: 10,
      images: [],
      description: '',
      amenities: [],
      rooms: [],
      startingPriceINR: 2000,
      sourceType: 'DEV_SAMPLE',
      verified: true,
    },
    {
      id: 'h2',
      name: 'Near Hotel',
      city: 'Jaipur',
      address: 'MI Road',
      coordinates: { lat: 26.9150, lng: 75.7890 },
      distanceFromStationKm: 1.5,
      starRating: 5,
      guestRating: 4.8,
      reviewsCount: 150,
      images: [],
      description: '',
      amenities: [],
      rooms: [],
      startingPriceINR: 4500,
      sourceType: 'DEV_SAMPLE',
      verified: true,
    },
  ];

  const nearby = findNearbyHotels(center, sampleHotels, 10);
  assert.equal(nearby.length, 1);
  assert.equal(nearby[0].id, 'h2');
  assert.ok(nearby[0].calculatedDistanceKm < 5);
});

test('calculatePriceBreakdown computes 5% GST for Bus and 12% for Hotel', () => {
  // Bus fare: ₹1000 base, 5% GST = ₹50, ₹20 platform fee = ₹1070
  const busPrice = calculatePriceBreakdown('BUS', 1000, 1);
  assert.equal(busPrice.baseAmount, 1000);
  assert.equal(busPrice.gstAmount, 50);
  assert.equal(busPrice.platformFee, 20);
  assert.equal(busPrice.totalAmount, 1070);

  // Hotel: ₹4000 base, 12% GST = ₹480, ₹20 platform fee = ₹4500
  const hotelPrice = calculatePriceBreakdown('HOTEL', 4000, 1);
  assert.equal(hotelPrice.baseAmount, 4000);
  assert.equal(hotelPrice.gstAmount, 480);
  assert.equal(hotelPrice.totalAmount, 4500);
});

test('isValidStatusTransition validates state machine transitions', () => {
  assert.equal(isValidStatusTransition('PENDING', 'CONFIRMED'), true);
  assert.equal(isValidStatusTransition('CONFIRMED', 'CANCELLED'), true);
  assert.equal(isValidStatusTransition('CANCELLED', 'REFUNDED'), true);
  // Invalid jump
  assert.equal(isValidStatusTransition('CANCELLED', 'CONFIRMED'), false);
  assert.equal(isValidStatusTransition('REFUNDED', 'PENDING'), false);
});

test('validateHotelDates detects invalid sequences', () => {
  const invalid = validateHotelDates('2026-11-10', '2026-11-05');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error?.includes('strictly after'));

  const valid = validateHotelDates('2026-11-10', '2026-11-15');
  assert.equal(valid.isValid, true);
});

test('validateIndianPhone checks 10-digit mobile numbers', () => {
  assert.equal(validateIndianPhone('9876543210'), true);
  assert.equal(validateIndianPhone('+91 9876543210'), true);
  assert.equal(validateIndianPhone('12345'), false);
  assert.equal(validateIndianPhone('4876543210'), false); // Doesn't start with 6-9
});

test('generateBookingReference produces expected prefix and format', () => {
  const ref = generateBookingReference('BUS');
  assert.ok(ref.startsWith('TF-BUS-2026-'));
});
