/**
 * Trip Flex In-Memory & LocalStorage Data Store
 * Provides relational records for Destinations, Buses, Trains, Hotels, Restaurants, Bookings, Users, and Audit Logs.
 * Strictly implements the 3 data source types: ADMIN_MANAGED, AUTHORIZED_PROVIDER, DEV_SAMPLE.
 */
import {
  AuditLog,
  Booking,
  BusService,
  DataSourceType,
  Destination,
  Hotel,
  PaymentAttempt,
  Restaurant,
  TrainJourney,
  User,
  UserRole,
  WebhookEvent,
} from './types';
import { generateBookingReference } from './validators';
import { calculatePriceBreakdown } from './pricing';
import { INDIAN_GEOGRAPHIC_DATASET, importIndianDestinations } from './destinationsData';

const STORAGE_KEY_PREFIX = 'tripflex_v1_';

export const INITIAL_DESTINATIONS: Destination[] = INDIAN_GEOGRAPHIC_DATASET;

export const INITIAL_BUSES: BusService[] = [
  {
    id: 'bus-101',
    operatorName: 'Zingbus Plus Intercity',
    busNumber: 'DL-01-AX-9912',
    busType: 'AC Sleeper (2+1)',
    originCity: 'New Delhi',
    originStation: 'Kashmere Gate ISBT Counter 4',
    destinationCity: 'Jaipur',
    destinationStation: 'Sindhi Camp Platform 3',
    departureTime: '22:30',
    arrivalTime: '04:30',
    duration: '6h 00m',
    baseFareINR: 650,
    availableSeats: 18,
    totalSeats: 30,
    rating: 4.6,
    reviewsCount: 420,
    amenities: ['Free Water Bottle', 'USB Charging Port', 'Reading Light', 'Blanket', 'GPS Live Tracking'],
    sourceType: 'DEV_SAMPLE',
    verified: true,
    providerId: 'prov-zingbus',
  },
  {
    id: 'bus-102',
    operatorName: 'IntrCity SmartBus Premium',
    busNumber: 'RJ-14-BT-4421',
    busType: 'Volvo Multi-Axle',
    originCity: 'New Delhi',
    originStation: 'Dhaula Kuan Metro Bus Stop',
    destinationCity: 'Jaipur',
    destinationStation: 'Narayan Singh Circle',
    departureTime: '06:00',
    arrivalTime: '11:15',
    duration: '5h 15m',
    baseFareINR: 799,
    availableSeats: 8,
    totalSeats: 36,
    rating: 4.8,
    reviewsCount: 890,
    amenities: ['Bus Captain Onboard', 'Emergency SOS', 'AC Climate Control', 'Reclining Seats'],
    sourceType: 'DEV_SAMPLE',
    verified: true,
    providerId: 'prov-intrcity',
  },
  {
    id: 'bus-103',
    operatorName: 'VRL Travel Lines',
    busNumber: 'MH-04-CX-8833',
    busType: 'AC Sleeper (2+1)',
    originCity: 'Mumbai',
    originStation: 'Borivali West Gokul Hotel',
    destinationCity: 'Goa',
    destinationStation: 'Mapusa Court Circle',
    departureTime: '18:00',
    arrivalTime: '07:30',
    duration: '13h 30m',
    baseFareINR: 1250,
    availableSeats: 12,
    totalSeats: 32,
    rating: 4.5,
    reviewsCount: 650,
    amenities: ['Pillow & Fresh Linen', 'Snack Kit', 'Individual TV Screen', 'Emergency Exit'],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'bus-104',
    operatorName: 'Northern Himalayan Express',
    busNumber: 'HP-01-EE-3120',
    busType: 'BharatBenz Executive',
    originCity: 'New Delhi',
    originStation: 'Majnu Ka Tilla Tibetan Colony',
    destinationCity: 'Manali',
    destinationStation: 'Private Bus Stand Manali',
    departureTime: '20:00',
    arrivalTime: '09:00',
    duration: '13h 00m',
    baseFareINR: 1150,
    availableSeats: 6,
    totalSeats: 28,
    rating: 4.7,
    reviewsCount: 310,
    amenities: ['Mountain suspension', 'Heater/AC', 'Luggage Compartment', 'Water Bottle'],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'bus-105',
    operatorName: 'Kashi Royal Fleet',
    busNumber: 'UP-65-ZT-1090',
    busType: 'AC Seater (2+2)',
    originCity: 'New Delhi',
    originStation: 'Anand Vihar ISBT',
    destinationCity: 'Varanasi',
    destinationStation: 'Varanasi Cantt Station Stand',
    departureTime: '17:30',
    arrivalTime: '08:00',
    duration: '14h 30m',
    baseFareINR: 1050,
    availableSeats: 14,
    totalSeats: 40,
    rating: 4.3,
    reviewsCount: 180,
    amenities: ['AC', 'Reclining Pushback Seats', 'Charging Ports', 'Music System'],
    sourceType: 'ADMIN_MANAGED',
    verified: true,
  },
];

export const INITIAL_TRAINS: TrainJourney[] = [
  {
    id: 'train-201',
    trainNumber: '12015',
    trainName: 'Ajmer Shatabdi Express',
    originStation: 'New Delhi',
    originCode: 'NDLS',
    destinationStation: 'Jaipur Junction',
    destinationCode: 'JP',
    departureTime: '06:10',
    arrivalTime: '10:40',
    duration: '4h 30m',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', name: 'AC Chair Car', baseFareINR: 765, status: 'AVAILABLE', seatsLeft: 42 },
      { code: '1A', name: 'Executive Anubhuti', baseFareINR: 1540, status: 'AVAILABLE', seatsLeft: 11 },
    ],
    sourceType: 'DEV_SAMPLE',
    authorizedIntegration: false,
    sourceNote: 'Schedule timetable from Indian Railways Open Schedule data. Live ticket booking integration adapter ready.',
  },
  {
    id: 'train-202',
    trainNumber: '20978',
    trainName: 'Vande Bharat Express',
    originStation: 'Delhi Cantt',
    originCode: 'DEC',
    destinationStation: 'Jaipur Junction',
    destinationCode: 'JP',
    departureTime: '18:40',
    arrivalTime: '22:45',
    duration: '4h 05m',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', name: 'AC Chair Car', baseFareINR: 880, status: 'AVAILABLE', seatsLeft: 29 },
      { code: '1A', name: 'Executive Chair Car', baseFareINR: 1650, status: 'AVAILABLE', seatsLeft: 7 },
    ],
    sourceType: 'DEV_SAMPLE',
    authorizedIntegration: false,
    sourceNote: 'High-speed semi-bullet express. Live ticket booking integration adapter ready.',
  },
  {
    id: 'train-203',
    trainNumber: '12051',
    trainName: 'Madgaon Jan Shatabdi Express',
    originStation: 'CSMT Mumbai',
    originCode: 'CSMT',
    destinationStation: 'Madgaon Junction',
    destinationCode: 'MAO',
    departureTime: '05:10',
    arrivalTime: '14:10',
    duration: '9h 00m',
    runsOnDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: '2S', name: 'Second Seating', baseFareINR: 320, status: 'AVAILABLE', seatsLeft: 78 } as any,
      { code: 'CC', name: 'AC Chair Car', baseFareINR: 1120, status: 'AVAILABLE', seatsLeft: 18 },
    ],
    sourceType: 'DEV_SAMPLE',
    authorizedIntegration: false,
    sourceNote: 'Scenic Konkan Railway route along waterfalls and coastal bridges.',
  },
  {
    id: 'train-204',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express (Varanasi)',
    originStation: 'New Delhi',
    originCode: 'NDLS',
    destinationStation: 'Varanasi Junction',
    destinationCode: 'BSB',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    runsOnDays: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', name: 'AC Chair Car', baseFareINR: 1750, status: 'AVAILABLE', seatsLeft: 35 },
      { code: '1A', name: 'Executive Chair Car', baseFareINR: 3300, status: 'AVAILABLE', seatsLeft: 6 },
    ],
    sourceType: 'DEV_SAMPLE',
    authorizedIntegration: false,
    sourceNote: 'Fastest connection between Delhi and Holy Kashi.',
  },
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-jaipur-1',
    name: 'The Heritage Haveli Palace & Spa',
    city: 'Jaipur',
    address: 'Near Sindhi Camp, Station Road, MI Road Area, Jaipur',
    coordinates: { lat: 26.9205, lng: 75.7950 },
    distanceFromStationKm: 1.2,
    starRating: 5,
    guestRating: 4.8,
    reviewsCount: 380,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Restored royal mansion showcasing handcrafted jharokhas, courtyards, swimming pool, and authentic Rajasthani dining.',
    amenities: ['Free High-Speed WiFi', 'Swimming Pool', 'Multi-Cuisine Restaurant', '24/7 Front Desk', 'Free Parking', 'Airport Shuttle'],
    startingPriceINR: 3499,
    rooms: [
      {
        id: 'room-j1-deluxe',
        name: 'Royal Heritage Deluxe Room',
        description: 'Spacious 350 sq ft room with traditional frescoes and king bed.',
        maxGuests: 2,
        bedType: '1 King Bed',
        pricePerNightINR: 3499,
        availableRooms: 5,
        amenities: ['AC', 'Smart TV', 'Tea Maker', 'Ensuite Marble Bathroom'],
      },
      {
        id: 'room-j1-suite',
        name: 'Maharaja Royal Suite with Courtyard View',
        description: 'Luxurious 600 sq ft suite with private sitting area and jacuzzi.',
        maxGuests: 3,
        bedType: '1 King Bed + 1 Sofa Bed',
        pricePerNightINR: 6200,
        availableRooms: 2,
        amenities: ['Jacuzzi', 'Complimentary Breakfast', 'Butler Service', 'Balcony'],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'hotel-jaipur-2',
    name: 'Boutique Transit Inn Jaipur',
    city: 'Jaipur',
    address: 'Opposite Railway Colony, Gopalbari, Jaipur',
    coordinates: { lat: 26.9180, lng: 75.7890 },
    distanceFromStationKm: 0.6,
    starRating: 3,
    guestRating: 4.4,
    reviewsCount: 190,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Clean, modern, and high-speed business and leisure hotel just 600 meters from Jaipur Junction Railway Station.',
    amenities: ['Free WiFi', 'AC', 'Elevator', 'Doctor on Call', 'Breakfast Available'],
    startingPriceINR: 1499,
    rooms: [
      {
        id: 'room-j2-std',
        name: 'Executive Queen Room',
        description: 'Air-conditioned soundproof room ideal for transit travellers.',
        maxGuests: 2,
        bedType: '1 Queen Bed',
        pricePerNightINR: 1499,
        availableRooms: 8,
        amenities: ['AC', 'Desk', 'Hot Shower'],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'hotel-goa-1',
    name: 'Candolim Sunset Beachfront Resort',
    city: 'Goa',
    address: 'Near Candolim Beach Promenade, North Goa',
    coordinates: { lat: 15.5180, lng: 73.7630 },
    distanceFromStationKm: 14.5,
    starRating: 4,
    guestRating: 4.7,
    reviewsCount: 520,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Direct beach access, infinity pool overlooking Arabian Sea, tropical cocktails, and live acoustic evenings.',
    amenities: ['Beach Access', 'Pool Bar', 'Free Breakfast', 'Scooter Rental Desk', 'Spa & Wellness'],
    startingPriceINR: 4299,
    rooms: [
      {
        id: 'room-g1-sea',
        name: 'Sea View Premium Balcony',
        description: 'Wake up to the sound of ocean waves with panoramic balcony view.',
        maxGuests: 2,
        bedType: '1 King Bed',
        pricePerNightINR: 4299,
        availableRooms: 4,
        amenities: ['Ocean View', 'Mini Bar', 'AC', 'Breakfast Included'],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'hotel-manali-1',
    name: 'Himalayan Pine View Mountain Lodge',
    city: 'Manali',
    address: 'Old Manali Road, Above Club House, Manali',
    coordinates: { lat: 32.2470, lng: 77.1820 },
    distanceFromStationKm: 1.8,
    starRating: 4,
    guestRating: 4.9,
    reviewsCount: 410,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Charming cedar wood chalets with uninterrupted vistas of snowcapped Pir Panjal peaks and apple gardens.',
    amenities: ['Mountain Panorama', 'Bonfire & Barbeque', 'Room Heaters', 'Trekking Desk', 'Cafe'],
    startingPriceINR: 2800,
    rooms: [
      {
        id: 'room-m1-chalet',
        name: 'Cedar Mountain Chalet',
        description: 'Cozy wooden interiors with large balcony overlooking snow peaks.',
        maxGuests: 3,
        bedType: '1 King + 1 Single',
        pricePerNightINR: 2800,
        availableRooms: 3,
        amenities: ['Heater', 'Balcony', 'Geyser', 'Mountain View'],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'hotel-delhi-1',
    name: 'The Connaught Grand Residency',
    city: 'New Delhi',
    address: 'Inner Circle, Connaught Place, New Delhi',
    coordinates: { lat: 28.6320, lng: 77.2180 },
    distanceFromStationKm: 1.1,
    starRating: 5,
    guestRating: 4.7,
    reviewsCount: 760,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Prime central location in Lutyens Delhi, walking distance to Shivaji Stadium Metro and NDLS station.',
    amenities: ['Fine Dining Restaurant', '24h Fitness Center', 'Business Center', 'Concierge'],
    startingPriceINR: 5200,
    rooms: [
      {
        id: 'room-d1-exec',
        name: 'Club Executive Room',
        description: 'Spacious workspace, plush mattress, and complimentary lounge access.',
        maxGuests: 2,
        bedType: '1 King Bed',
        pricePerNightINR: 5200,
        availableRooms: 6,
        amenities: ['Lounge Access', 'Coffee Machine', 'Bathtub'],
      },
    ],
    sourceType: 'ADMIN_MANAGED',
    verified: true,
  },
  {
    id: 'hotel-varanasi-1',
    name: 'Ganga Kashi Heritage Ghat Villa',
    city: 'Varanasi',
    address: 'Near Assi Ghat, Shivala, Varanasi',
    coordinates: { lat: 25.2950, lng: 83.0030 },
    distanceFromStationKm: 3.5,
    starRating: 4,
    guestRating: 4.8,
    reviewsCount: 320,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Direct sunrise view over River Ganga. Daily morning classical music and evening aarti boat transfers.',
    amenities: ['River Ganga View', 'Rooftop Yoga', 'Vegetarian Kitchen', 'Boat Tour Desk'],
    startingPriceINR: 3100,
    rooms: [
      {
        id: 'room-v1-ganga',
        name: 'Ganga Sunrise Deluxe Room',
        description: 'Window overlooking the sacred ghats and morning sunrise.',
        maxGuests: 2,
        bedType: '1 Double Bed',
        pricePerNightINR: 3100,
        availableRooms: 4,
        amenities: ['River View', 'AC', 'Pure Veg Breakfast Included'],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-jaipur-1',
    name: 'Handi Restaurant & Barbecue',
    city: 'Jaipur',
    address: 'Maya Mansion, Opposite GPO, MI Road, Jaipur',
    coordinates: { lat: 26.9175, lng: 75.8050 },
    distanceFromStationKm: 1.4,
    cuisine: ['Authentic Rajasthani', 'North Indian', 'Tandoori'],
    costForTwoINR: 900,
    rating: 4.7,
    reviewsCount: 890,
    openingHours: '12:00 PM - 11:30 PM',
    availableSlots: ['12:30 PM', '1:30 PM', '7:30 PM', '8:30 PM', '9:30 PM'],
    maxCapacityPerSlot: 20,
    currentBookedSlots: { '8:30 PM': 6, '7:30 PM': 4 },
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Acclaimed Lal Maas', 'AC Family Dining', 'Outdoor Terrace', 'Valet Parking'],
    sampleMenu: [
      {
        categoryName: 'Royal Rajasthani Specialties',
        items: [
          { name: 'Traditional Handi Lal Maas', description: 'Slow cooked tender mutton with Mathania chillies', priceINR: 480, isVeg: false },
          { name: 'Dal Baati Churma Platter', description: 'Five-lentil dal with ghee baked baatis and sweet churma', priceINR: 340, isVeg: true },
          { name: 'Ker Sangri Dry Curry', description: 'Desert beans and berries in authentic spices', priceINR: 320, isVeg: true },
        ],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'rest-jaipur-2',
    name: 'Rawat Mishtan Bhandar & Bhojanalaya',
    city: 'Jaipur',
    address: 'Station Road, Opposite Sindhi Camp, Jaipur',
    coordinates: { lat: 26.9210, lng: 75.7980 },
    distanceFromStationKm: 0.4,
    cuisine: ['Pure Vegetarian', 'Street Snacks', 'Rajasthani Thali'],
    costForTwoINR: 400,
    rating: 4.8,
    reviewsCount: 2400,
    openingHours: '06:00 AM - 10:30 PM',
    availableSlots: ['12:00 PM', '1:00 PM', '2:00 PM', '7:00 PM', '8:00 PM'],
    maxCapacityPerSlot: 40,
    currentBookedSlots: { '1:00 PM': 12 },
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Legendary Pyaaz Kachori', 'Fast Service', 'Pure Veg', 'Near Bus & Train Station'],
    sampleMenu: [
      {
        categoryName: 'Heritage Breakfast & Snacks',
        items: [
          { name: 'Famous Pyaaz Kachori (2 pcs)', description: 'Crisp layered crust stuffed with seasoned spiced onions', priceINR: 110, isVeg: true },
          { name: 'Special Shahi Thali', description: 'Paneer, dal makhani, dry veg, rotis, rice, gulab jamun', priceINR: 280, isVeg: true },
        ],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'rest-goa-1',
    name: "Fisherman's Wharf Coastal Diner",
    city: 'Goa',
    address: 'Near Sal Riverfront, Cavelossim & Panaji Waterfront, Goa',
    coordinates: { lat: 15.3020, lng: 74.0150 },
    distanceFromStationKm: 8.2,
    cuisine: ['Goan Seafood', 'Portuguese Fusion', 'Cocktails'],
    costForTwoINR: 1200,
    rating: 4.7,
    reviewsCount: 1400,
    openingHours: '12:00 PM - 11:00 PM',
    availableSlots: ['1:00 PM', '2:00 PM', '7:30 PM', '8:30 PM', '9:30 PM'],
    maxCapacityPerSlot: 24,
    currentBookedSlots: { '8:30 PM': 8 },
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Live Crab & Tiger Prawns', 'Riverfront Seating', 'Live Bands', 'Full Bar'],
    sampleMenu: [
      {
        categoryName: 'Goan Coastal Delights',
        items: [
          { name: 'Goan Fish Curry with Steamed Rice', description: 'Fresh kingfish simmered in coconut and kokum gravy', priceINR: 420, isVeg: false },
          { name: 'Prawns Balchao', description: 'Spicy tangy Goan pickled prawn masala with poi bread', priceINR: 490, isVeg: false },
        ],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'rest-manali-1',
    name: 'Cafe 1947 Riverside Bistro',
    city: 'Manali',
    address: 'Old Manali, by the Manalsu River, Manali',
    coordinates: { lat: 32.2530, lng: 77.1790 },
    distanceFromStationKm: 2.2,
    cuisine: ['Woodfired Italian Pizza', 'Himalayan Trout', 'Continental'],
    costForTwoINR: 850,
    rating: 4.9,
    reviewsCount: 940,
    openingHours: '11:00 AM - 11:00 PM',
    availableSlots: ['1:00 PM', '3:00 PM', '7:00 PM', '8:30 PM'],
    maxCapacityPerSlot: 16,
    currentBookedSlots: { '8:30 PM': 5 },
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Gurgling River Sound', 'Acoustic Guitar Sets', 'Wood Oven Pizza', 'Warm Fireplace'],
    sampleMenu: [
      {
        categoryName: 'House Specials',
        items: [
          { name: 'Fresh Himalayan Pan-Fried Trout', description: 'Locally caught river trout with lemon butter garlic herbs', priceINR: 550, isVeg: false },
          { name: 'Quattro Formaggi Pizza (12 inch)', description: 'Thin crust with mozzarella, cheddar, gorgonzola, parmesan', priceINR: 480, isVeg: true },
        ],
      },
    ],
    sourceType: 'DEV_SAMPLE',
    verified: true,
  },
  {
    id: 'rest-delhi-1',
    name: "Karim's Historic Mughal Dine",
    city: 'New Delhi',
    address: 'Gali Kababian, Jama Masjid, Old Delhi',
    coordinates: { lat: 28.6508, lng: 77.2334 },
    distanceFromStationKm: 1.6,
    cuisine: ['Mughlai Heritage', 'Kebabs', 'Biryani'],
    costForTwoINR: 800,
    rating: 4.6,
    reviewsCount: 3100,
    openingHours: '11:30 AM - 11:30 PM',
    availableSlots: ['1:00 PM', '2:00 PM', '8:00 PM', '9:30 PM'],
    maxCapacityPerSlot: 30,
    currentBookedSlots: { '8:00 PM': 14 },
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Established 1913', 'Royal Mughal Recipes', 'Famous Mutton Seekh Kebab'],
    sampleMenu: [
      {
        categoryName: 'Royal Kebabs & Curries',
        items: [
          { name: 'Mutton Seekh Kebab (4 pcs)', description: 'Minced lamb skewered and char-grilled on coal', priceINR: 320, isVeg: false },
          { name: 'Chicken Jahangiri with Roomali Roti', description: 'Rich creamy tomato gravy with dry fruits', priceINR: 410, isVeg: false },
        ],
      },
    ],
    sourceType: 'ADMIN_MANAGED',
    verified: true,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@tripflex.in',
    name: 'Dev Admin (Trip Flex)',
    role: 'ADMIN',
    phone: '9810012345',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-customer-1',
    email: 'arjun.sharma@gmail.com',
    name: 'Arjun Sharma',
    role: 'CUSTOMER',
    phone: '9876543210',
    createdAt: '2026-02-15T10:30:00Z',
  },
  {
    id: 'usr-provider-1',
    email: 'partner@royalbuses.in',
    name: 'Rajesh Varma (Fleet Partner)',
    role: 'PROVIDER',
    phone: '9820054321',
    createdAt: '2026-03-01T12:00:00Z',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-001',
    bookingReference: 'TF-BUS-2026-88124',
    userId: 'usr-customer-1',
    userEmail: 'arjun.sharma@gmail.com',
    userName: 'Arjun Sharma',
    userPhone: '9876543210',
    serviceType: 'BUS',
    serviceId: 'bus-101',
    serviceName: 'Zingbus Plus Intercity',
    serviceDetails: {
      origin: 'New Delhi',
      destination: 'Jaipur',
      travelDate: '2026-11-15',
      travelTime: '22:30',
      seatNumbers: ['U4', 'U5'],
      passengersCount: 2,
    },
    priceBreakdown: calculatePriceBreakdown('BUS', 650, 2),
    status: 'CONFIRMED',
    sourceType: 'DEV_SAMPLE',
    isAuthorizedFulfillment: true,
    createdAt: '2026-10-20T14:30:00Z',
    notes: 'Development sample booking. Boarding at Kashmere Gate ISBT.',
  },
  {
    id: 'book-002',
    bookingReference: 'TF-HTL-2026-31092',
    userId: 'usr-customer-1',
    userEmail: 'arjun.sharma@gmail.com',
    userName: 'Arjun Sharma',
    userPhone: '9876543210',
    serviceType: 'HOTEL',
    serviceId: 'hotel-jaipur-1',
    serviceName: 'The Heritage Haveli Palace & Spa',
    serviceDetails: {
      destination: 'Jaipur',
      roomType: 'Royal Heritage Deluxe Room',
      checkInDate: '2026-11-16',
      checkOutDate: '2026-11-18',
      nights: 2,
    },
    priceBreakdown: calculatePriceBreakdown('HOTEL', 3499, 2),
    status: 'CONFIRMED',
    sourceType: 'DEV_SAMPLE',
    isAuthorizedFulfillment: true,
    createdAt: '2026-10-20T14:35:00Z',
    notes: 'Independent hotel booking. 2 nights stay reserved.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-01',
    timestamp: '2026-10-23T08:00:00Z',
    userEmail: 'admin@tripflex.in',
    action: 'INITIALIZE_MARKETPLACE',
    entityType: 'PLATFORM',
    entityId: 'ROOT',
    details: 'Foundation seed records initialized with 6 destinations, 5 buses, 4 trains, 6 hotels, 5 restaurants.',
  },
  {
    id: 'audit-02',
    timestamp: '2026-10-23T09:15:00Z',
    userEmail: 'admin@tripflex.in',
    action: 'VERIFY_LISTING',
    entityType: 'HOTEL',
    entityId: 'hotel-jaipur-1',
    details: 'Marked The Heritage Haveli Palace & Spa as verified admin-managed listing.',
  },
];

// Helper to safely load or initialize data
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export class TripFlexStore {
  static getDestinations(): Destination[] {
    return loadFromStorage('destinations', INITIAL_DESTINATIONS);
  }

  static saveDestinations(items: Destination[]): void {
    saveToStorage('destinations', items);
  }

  static addDestination(dest: Destination, adminEmail: string): void {
    const all = this.getDestinations();
    all.push(dest);
    this.saveDestinations(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'ADD_DESTINATION',
      entityType: 'DESTINATION',
      entityId: dest.id,
      details: `Added new destination: ${dest.name}, ${dest.state}`,
    });
  }

  static getBuses(): BusService[] {
    return loadFromStorage('buses', INITIAL_BUSES);
  }

  static saveBuses(items: BusService[]): void {
    saveToStorage('buses', items);
  }

  static addBus(bus: BusService, adminEmail: string): void {
    const all = this.getBuses();
    all.push(bus);
    this.saveBuses(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'ADD_BUS_SERVICE',
      entityType: 'BUS',
      entityId: bus.id,
      details: `Added route: ${bus.operatorName} (${bus.originCity} -> ${bus.destinationCity})`,
    });
  }

  static getTrains(): TrainJourney[] {
    return loadFromStorage('trains', INITIAL_TRAINS);
  }

  static saveTrains(items: TrainJourney[]): void {
    saveToStorage('trains', items);
  }

  static getHotels(): Hotel[] {
    return loadFromStorage('hotels', INITIAL_HOTELS);
  }

  static saveHotels(items: Hotel[]): void {
    saveToStorage('hotels', items);
  }

  static addHotel(hotel: Hotel, adminEmail: string): void {
    const all = this.getHotels();
    all.push(hotel);
    this.saveHotels(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'ADD_HOTEL',
      entityType: 'HOTEL',
      entityId: hotel.id,
      details: `Added hotel listing: ${hotel.name} in ${hotel.city}`,
    });
  }

  static toggleHotelVerification(hotelId: string, adminEmail: string): boolean {
    const all = this.getHotels();
    const target = all.find((h) => h.id === hotelId);
    if (!target) return false;
    target.verified = !target.verified;
    this.saveHotels(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'TOGGLE_VERIFICATION',
      entityType: 'HOTEL',
      entityId: hotelId,
      details: `Verification changed to ${target.verified} for ${target.name}`,
    });
    return target.verified;
  }

  static getRestaurants(): Restaurant[] {
    return loadFromStorage('restaurants', INITIAL_RESTAURANTS);
  }

  static saveRestaurants(items: Restaurant[]): void {
    saveToStorage('restaurants', items);
  }

  static addRestaurant(rest: Restaurant, adminEmail: string): void {
    const all = this.getRestaurants();
    all.push(rest);
    this.saveRestaurants(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'ADD_RESTAURANT',
      entityType: 'RESTAURANT',
      entityId: rest.id,
      details: `Added restaurant listing: ${rest.name} in ${rest.city}`,
    });
  }

  static toggleRestaurantVerification(restId: string, adminEmail: string): boolean {
    const all = this.getRestaurants();
    const target = all.find((r) => r.id === restId);
    if (!target) return false;
    target.verified = !target.verified;
    this.saveRestaurants(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'TOGGLE_VERIFICATION',
      entityType: 'RESTAURANT',
      entityId: restId,
      details: `Verification changed to ${target.verified} for ${target.name}`,
    });
    return target.verified;
  }

  static getBookings(): Booking[] {
    return loadFromStorage('bookings', INITIAL_BOOKINGS);
  }

  static saveBookings(items: Booking[]): void {
    saveToStorage('bookings', items);
  }

  static createBooking(booking: Omit<Booking, 'id' | 'bookingReference' | 'createdAt'>): Booking {
    const all = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: 'book-' + Date.now(),
      bookingReference: generateBookingReference(booking.serviceType),
      createdAt: new Date().toISOString(),
    };
    all.unshift(newBooking);
    this.saveBookings(all);
    return newBooking;
  }

  static cancelBooking(bookingId: string, userEmail: string): boolean {
    const all = this.getBookings();
    const item = all.find((b) => b.id === bookingId);
    if (!item) return false;
    if (item.status === 'CANCELLED' || item.status === 'REFUNDED') return false;
    item.status = 'CANCELLED';
    this.saveBookings(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail,
      action: 'CANCEL_BOOKING',
      entityType: 'BOOKING',
      entityId: bookingId,
      details: `Booking ${item.bookingReference} marked CANCELLED`,
    });
    return true;
  }

  static getUsers(): User[] {
    return loadFromStorage('users', INITIAL_USERS);
  }

  static saveUsers(users: User[]): void {
    saveToStorage('users', users);
  }

  static getCurrentUser(): User {
    return loadFromStorage('currentUser', INITIAL_USERS[0]); // Default to Admin for testing
  }

  static setCurrentUser(user: User): void {
    saveToStorage('currentUser', user);
  }

  static getAuditLogs(): AuditLog[] {
    return loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(log: AuditLog): void {
    const logs = this.getAuditLogs();
    logs.unshift(log);
    saveToStorage('auditLogs', logs.slice(0, 100)); // retain last 100
  }

  static updateDestination(dest: Destination, adminEmail: string): void {
    const all = this.getDestinations();
    const idx = all.findIndex((d) => d.id === dest.id);
    if (idx >= 0) {
      all[idx] = { ...dest, updatedAt: new Date().toISOString() };
    } else {
      all.push(dest);
    }
    this.saveDestinations(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'UPDATE_DESTINATION',
      entityType: 'DESTINATION',
      entityId: dest.id,
      details: `Updated destination ${dest.name}, ${dest.state} (Status: ${dest.isActive ? 'Active' : 'Inactive'})`,
    });
  }

  static toggleDestinationActive(destId: string, adminEmail: string): boolean {
    const all = this.getDestinations();
    const target = all.find((d) => d.id === destId);
    if (!target) return false;
    target.isActive = !target.isActive;
    target.updatedAt = new Date().toISOString();
    this.saveDestinations(all);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'TOGGLE_DESTINATION_STATUS',
      entityType: 'DESTINATION',
      entityId: destId,
      details: `Destination ${target.name} active status set to ${target.isActive}`,
    });
    return target.isActive;
  }

  static importDestinations(adminEmail: string): { addedCount: number; updatedCount: number; totalCount: number } {
    const current = this.getDestinations();
    const { merged, addedCount, updatedCount } = importIndianDestinations(current);
    this.saveDestinations(merged);
    this.addAuditLog({
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: adminEmail,
      action: 'IMPORT_INDIAN_DESTINATIONS',
      entityType: 'DESTINATION_DATASET',
      entityId: 'ALL',
      details: `Repeatable import executed: ${addedCount} destinations added, ${updatedCount} updated, total dataset size ${merged.length}. Zero duplicates.`,
    });
    return { addedCount, updatedCount, totalCount: merged.length };
  }

  // --- PAYMENT ATTEMPTS & GATEWAY AUDIT ---
  static getPaymentAttempts(): PaymentAttempt[] {
    return loadFromStorage('paymentAttempts', []);
  }

  static savePaymentAttempts(attempts: PaymentAttempt[]): void {
    saveToStorage('paymentAttempts', attempts);
  }

  static addPaymentAttempt(attempt: PaymentAttempt): void {
    const all = this.getPaymentAttempts();
    all.unshift(attempt);
    this.savePaymentAttempts(all);
  }

  static updatePaymentAttempt(attemptId: string, updates: Partial<PaymentAttempt>): PaymentAttempt | null {
    const all = this.getPaymentAttempts();
    const idx = all.findIndex((a) => a.id === attemptId || a.orderId === attemptId);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.savePaymentAttempts(all);
    return all[idx];
  }

  // --- WEBHOOK EVENTS (IDEMPOTENCY) ---
  static getWebhookEvents(): WebhookEvent[] {
    return loadFromStorage('webhookEvents', []);
  }

  static saveWebhookEvents(events: WebhookEvent[]): void {
    saveToStorage('webhookEvents', events);
  }

  static addWebhookEvent(evt: WebhookEvent): void {
    const all = this.getWebhookEvents();
    all.unshift(evt);
    this.saveWebhookEvents(all.slice(0, 100)); // Retain last 100 events
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'destinations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'buses');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'trains');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'hotels');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'restaurants');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'bookings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'auditLogs');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'currentUser');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'paymentAttempts');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'webhookEvents');
  }
}
