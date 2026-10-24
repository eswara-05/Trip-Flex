/**
 * Geographic calculation utilities using Haversine formula
 * Complies with requirement: conventional programming & geographic calculations
 */
import { Coordinates, Hotel, Restaurant } from './types';

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates straight-line distance in kilometers between two geographic points
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Filter and sort hotels by proximity to a given coordinate
 */
export function findNearbyHotels(
  center: Coordinates,
  hotels: Hotel[],
  maxDistanceKm: number = 25
): (Hotel & { calculatedDistanceKm: number })[] {
  return hotels
    .map((hotel) => ({
      ...hotel,
      calculatedDistanceKm: calculateDistanceKm(center, hotel.coordinates),
    }))
    .filter((hotel) => hotel.calculatedDistanceKm <= maxDistanceKm)
    .sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
}

/**
 * Filter and sort restaurants by proximity to a given coordinate
 */
export function findNearbyRestaurants(
  center: Coordinates,
  restaurants: Restaurant[],
  maxDistanceKm: number = 25
): (Restaurant & { calculatedDistanceKm: number })[] {
  return restaurants
    .map((restaurant) => ({
      ...restaurant,
      calculatedDistanceKm: calculateDistanceKm(center, restaurant.coordinates),
    }))
    .filter((restaurant) => restaurant.calculatedDistanceKm <= maxDistanceKm)
    .sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
}
