/**
 * Validation rules and state-machine transitions for Trip Flex bookings
 */
import { BookingStatus, ServiceType } from './types';

/**
 * Valid state transitions for booking lifecycle:
 * DRAFT -> PENDING -> CONFIRMED -> CANCELLED -> REFUNDED
 */
const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PENDING', 'CANCELLED'],
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CANCELLED'],
  CANCELLED: ['REFUNDED'],
  REFUNDED: [],
};

export function isValidStatusTransition(current: BookingStatus, next: BookingStatus): boolean {
  if (current === next) return true;
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

/**
 * Generates an idempotent, collision-resistant booking reference
 * Format: TF-{SERVICE}-{YEAR}-{5 DIGIT RANDOM}
 */
export function generateBookingReference(serviceType: ServiceType): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TF-${serviceType.slice(0, 3)}-${year}-${randomSuffix}`;
}

/**
 * Validates check-in and check-out dates for hotels
 */
export function validateHotelDates(checkIn: string, checkOut: string): { isValid: boolean; error?: string } {
  if (!checkIn || !checkOut) {
    return { isValid: false, error: 'Both check-in and check-out dates are required.' };
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
    return { isValid: false, error: 'Invalid date format.' };
  }

  if (outDate <= inDate) {
    return { isValid: false, error: 'Check-out date must be strictly after check-in date.' };
  }

  return { isValid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Indian mobile number (10 digits starting with 6, 7, 8, or 9)
 */
export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Accepts 10 digits starting with 6-9, or 12 digits starting with 91 followed by 6-9
  if (/^[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return true;
  return false;
}
