/**
 * Transparent pricing calculation for Trip Flex services
 * Follows Indian market standards: GST + zero hidden surcharge transparency
 */
import { PriceBreakdown, ServiceType } from './types';

export const GST_RATES: Record<ServiceType, number> = {
  BUS: 0.05,        // 5% GST on passenger transport
  TRAIN: 0.05,      // 5% GST on railway services
  HOTEL: 0.12,      // 12% GST on hotel stays < ₹7,500/night
  RESTAURANT: 0.05, // 5% GST on restaurant food/dining
};

export const PLATFORM_CONVENIENCE_FEE = 20; // ₹20 flat platform maintenance fee in INR

/**
 * Calculates itemized price breakdown in INR
 */
export function calculatePriceBreakdown(
  serviceType: ServiceType,
  baseAmount: number,
  quantity: number = 1
): PriceBreakdown {
  const safeBase = Math.max(0, baseAmount * quantity);
  const rate = GST_RATES[serviceType] || 0.05;
  const gstAmount = Math.round(safeBase * rate * 100) / 100;
  
  // For restaurant table reservation deposit/token, platform fee is ₹0 or nominal
  const platformFee = serviceType === 'RESTAURANT' ? 0 : PLATFORM_CONVENIENCE_FEE;
  const totalAmount = Math.round((safeBase + gstAmount + platformFee) * 100) / 100;

  return {
    baseAmount: safeBase,
    gstAmount,
    gstRate: rate,
    platformFee,
    totalAmount,
    currency: 'INR',
  };
}

/**
 * Formats a number to Indian Rupee representation (e.g., ₹1,250)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
