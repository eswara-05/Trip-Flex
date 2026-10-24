/**
 * Trip Flex Domain Models & TypeScript Interfaces
 * Corresponds to MySQL relational database tables / Django models
 */

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'PROVIDER' | 'STAFF';

export type DataSourceType = 'ADMIN_MANAGED' | 'AUTHORIZED_PROVIDER' | 'DEV_SAMPLE';

export type BookingStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';

export type ServiceType = 'BUS' | 'TRAIN' | 'HOTEL' | 'RESTAURANT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export type DestinationType =
  | 'METRO'
  | 'HERITAGE'
  | 'HILL_STATION'
  | 'BEACH'
  | 'SPIRITUAL'
  | 'WILDLIFE'
  | 'CITY'
  | 'NATURE'
  | 'ISLAND';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  destinationType: DestinationType;
  popularFor: string;
  tagline: string;
  imageUrl: string;
  coordinates: Coordinates;
  majorHubs: {
    busStations: string[];
    railwayStations: string[];
  };
  isActive: boolean;
  sourceType: DataSourceType;
  isVerified?: boolean;
  updatedAt?: string;
}

export type PaymentGatewayStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export type PrototypePaymentMethod =
  | 'PROTOTYPE_1CLICK'
  | 'PROTOTYPE_UPI'
  | 'PROTOTYPE_CARD'
  | 'PROTOTYPE_NETBANKING'
  | 'PROTOTYPE_PAY_ON_BOARDING'
  | 'RAZORPAY_GATEWAY';

export interface PaymentAttempt {
  id: string;
  orderId: string;
  bookingReference: string;
  serviceType: ServiceType;
  serviceId: string;
  serviceName: string;
  userEmail: string;
  userName: string;
  amountINR: number;
  currency: 'INR';
  status: PaymentGatewayStatus;
  paymentMethod?: PrototypePaymentMethod | string;
  isPrototype?: boolean;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  failureReason?: string;
  refundId?: string;
  refundAmountINR?: number;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
}

export interface WebhookEvent {
  id: string;
  eventId: string;
  event: string;
  orderId?: string;
  paymentId?: string;
  processedAt: string;
  payload: Record<string, any>;
}

export interface BusService {
  id: string;
  operatorName: string;
  busNumber: string;
  busType: 'AC Sleeper (2+1)' | 'AC Seater (2+2)' | 'Volvo Multi-Axle' | 'BharatBenz Executive';
  originCity: string;
  originStation: string;
  destinationCity: string;
  destinationStation: string;
  departureTime: string; // e.g. "21:30"
  arrivalTime: string;   // e.g. "06:00"
  duration: string;      // e.g. "8h 30m"
  baseFareINR: number;
  availableSeats: number;
  totalSeats: number;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  sourceType: DataSourceType;
  verified: boolean;
  providerId?: string;
}

export interface TrainJourney {
  id: string;
  trainNumber: string;
  trainName: string;
  originStation: string;
  originCode: string;
  destinationStation: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOnDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  classes: {
    code: '1A' | '2A' | '3A' | 'SL' | 'CC';
    name: string;
    baseFareINR: number;
    status: 'AVAILABLE' | 'RAC' | 'WL' | 'REGISTRATION_REQUIRED';
    seatsLeft: number;
  }[];
  sourceType: DataSourceType;
  authorizedIntegration: boolean; // Indicates if live PNR / ticket booking integration is linked
  sourceNote: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  bedType: string;
  pricePerNightINR: number;
  availableRooms: number;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: Coordinates;
  distanceFromStationKm: number; // calculated relative to central transit
  starRating: number;
  guestRating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  amenities: string[];
  rooms: HotelRoom[];
  startingPriceINR: number;
  sourceType: DataSourceType;
  verified: boolean;
  providerId?: string;
}

export interface RestaurantMenuCategory {
  categoryName: string;
  items: {
    name: string;
    description: string;
    priceINR: number;
    isVeg: boolean;
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: Coordinates;
  distanceFromStationKm: number;
  cuisine: string[];
  costForTwoINR: number;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  availableSlots: string[]; // e.g. ['12:30 PM', '1:00 PM', '7:30 PM', '8:00 PM']
  maxCapacityPerSlot: number;
  currentBookedSlots: Record<string, number>; // slot -> count
  images: string[];
  features: string[]; // e.g. 'Pure Veg', 'AC Dining', 'Rooftop'
  sampleMenu: RestaurantMenuCategory[];
  sourceType: DataSourceType;
  verified: boolean;
}

export interface PriceBreakdown {
  baseAmount: number;
  gstAmount: number;
  gstRate: number; // e.g. 0.05 or 0.12
  platformFee: number;
  totalAmount: number;
  currency: 'INR';
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "TF-2026-BUS-1029"
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  serviceType: ServiceType;
  serviceId: string;
  serviceName: string;
  serviceDetails: {
    origin?: string;
    destination?: string;
    travelDate?: string;
    travelTime?: string;
    seatNumbers?: string[];
    passengersCount?: number;
    roomType?: string;
    checkInDate?: string;
    checkOutDate?: string;
    nights?: number;
    partySize?: number;
    reservationTime?: string;
  };
  priceBreakdown: PriceBreakdown;
  status: BookingStatus;
  paymentOrderId?: string;
  paymentId?: string;
  paymentStatus?: PaymentGatewayStatus;
  paymentMethod?: PrototypePaymentMethod | string;
  isPrototype?: boolean;
  sourceType: DataSourceType;
  isAuthorizedFulfillment: boolean;
  createdAt: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}
