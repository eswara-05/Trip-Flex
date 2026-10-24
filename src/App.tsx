import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchHero } from './components/SearchHero';
import { BusListingCard } from './components/BusListingCard';
import { TrainListingCard } from './components/TrainListingCard';
import { HotelListingCard } from './components/HotelListingCard';
import { RestaurantListingCard } from './components/RestaurantListingCard';
import { DestinationHub } from './components/DestinationHub';
import { DestinationDirectory } from './components/DestinationDirectory';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { AdminPanel } from './components/AdminPanel';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AuthModal } from './components/AuthModal';
import { TripFlexStore } from './lib/store';
import {
  Booking,
  BusService,
  Destination,
  Hotel,
  Restaurant,
  ServiceType,
  TrainJourney,
  User,
  UserRole,
} from './lib/types';
import { Bus, Train, Hotel as HotelIcon, Utensils, MapPin, Sparkles, Filter, Info, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  // Core state from store
  const [currentUser, setCurrentUser] = useState<User>(() => TripFlexStore.getCurrentUser());
  const [destinations, setDestinations] = useState<Destination[]>(() => TripFlexStore.getDestinations());
  const [buses, setBuses] = useState<BusService[]>(() => TripFlexStore.getBuses());
  const [trains, setTrains] = useState<TrainJourney[]>(() => TripFlexStore.getTrains());
  const [hotels, setHotels] = useState<Hotel[]>(() => TripFlexStore.getHotels());
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => TripFlexStore.getRestaurants());
  const [bookings, setBookings] = useState<Booking[]>(() => TripFlexStore.getBookings());
  const [auditLogs, setAuditLogs] = useState(() => TripFlexStore.getAuditLogs());

  // Navigation & Search state
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchService, setSearchService] = useState<ServiceType>('BUS');
  const [filterCity, setFilterCity] = useState<string>('Jaipur');
  const [activeDestinationView, setActiveDestinationView] = useState<Destination | null>(null);

  // Modals & Drawers
  const [bookingItem, setBookingItem] = useState<{
    serviceType: ServiceType;
    item: BusService | TrainJourney | Hotel | Restaurant;
    initialSlot?: string;
  } | null>(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadData = () => {
    setDestinations(TripFlexStore.getDestinations());
    setBuses(TripFlexStore.getBuses());
    setTrains(TripFlexStore.getTrains());
    setHotels(TripFlexStore.getHotels());
    setRestaurants(TripFlexStore.getRestaurants());
    setBookings(TripFlexStore.getBookings());
    setAuditLogs(TripFlexStore.getAuditLogs());
    setCurrentUser(TripFlexStore.getCurrentUser());
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const updatedUser = { ...currentUser, role: newRole };
    TripFlexStore.setCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleSearch = (params: {
    serviceType: ServiceType;
    origin?: string;
    destinationCity: string;
    date?: string;
    passengersOrGuests?: number;
  }) => {
    setFilterCity(params.destinationCity);
    setActiveTab(params.serviceType.toLowerCase());
    // Also scroll down smoothly to results
    const resultsElem = document.getElementById('marketplace-results');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookService = (
    serviceType: ServiceType,
    item: BusService | TrainJourney | Hotel | Restaurant,
    initialSlot?: string
  ) => {
    setBookingItem({ serviceType, item, initialSlot });
  };

  const handleBookingConfirmed = (booking: Booking) => {
    reloadData();
    setToastMessage(`Booking ${booking.bookingReference} confirmed!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCancelBooking = (bookingId: string) => {
    TripFlexStore.cancelBooking(bookingId, currentUser.email);
    reloadData();
    setToastMessage(`Booking marked as cancelled.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered datasets based on search and active tab
  const filteredBuses = buses.filter(
    (b) =>
      b.destinationCity.toLowerCase().includes(filterCity.toLowerCase()) ||
      b.originCity.toLowerCase().includes(filterCity.toLowerCase())
  );

  const filteredTrains = trains.filter(
    (t) =>
      t.destinationStation.toLowerCase().includes(filterCity.toLowerCase()) ||
      t.originStation.toLowerCase().includes(filterCity.toLowerCase())
  );

  const filteredHotels = hotels.filter((h) =>
    h.city.toLowerCase().includes(filterCity.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter((r) =>
    r.city.toLowerCase().includes(filterCity.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] text-[#111111]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#111111] text-white border-l-4 border-[#E50914] px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onSwitchRole={handleRoleSwitch}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBookings={() => setIsBookingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        bookingCount={bookings.filter((b) => b.status === 'CONFIRMED').length}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'bus') setSearchService('BUS');
          else if (tab === 'train') setSearchService('TRAIN');
          else if (tab === 'hotel') setSearchService('HOTEL');
          else if (tab === 'restaurant') setSearchService('RESTAURANT');
        }}
      />

      {/* Hero with Tabbed Service Search (Database-driven) */}
      <SearchHero
        destinations={destinations}
        selectedDestinationName={filterCity}
        onSearch={handleSearch}
        activeService={searchService}
        setActiveService={(srv) => {
          setSearchService(srv);
          setActiveTab(srv.toLowerCase());
        }}
        onSelectDestinationChip={(city) => {
          setFilterCity(city);
          const found = destinations.find((d) => d.name.toLowerCase() === city.toLowerCase());
          if (found) {
            setActiveDestinationView(found);
          }
        }}
      />

      {/* Main Content Area */}
      <main id="marketplace-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Destination Discovery Hub (if opened) */}
        {activeDestinationView && (
          <DestinationHub
            destination={activeDestinationView}
            allHotels={hotels}
            allRestaurants={restaurants}
            onBookHotel={(hotel) => handleBookService('HOTEL', hotel)}
            onBookRestaurant={(rest, slot) => handleBookService('RESTAURANT', rest, slot)}
            onClose={() => setActiveDestinationView(null)}
          />
        )}

        {/* Filter & City Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Transit Hub:
            </span>
            <span className="font-heading font-extrabold text-base text-black flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E50914]" />
              {filterCity}
            </span>
            <span className="text-xs text-gray-400">
              ({filteredBuses.length} Buses, {filteredTrains.length} Trains, {filteredHotels.length} Hotels, {filteredRestaurants.length} Dining)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const found = destinations.find((d) => d.name.toLowerCase() === filterCity.toLowerCase()) || destinations[0];
                setActiveDestinationView(found);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#E50914] text-white hover:bg-[#B20710] transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore {filterCity} Transit Hub & Nearby</span>
            </button>
          </div>
        </div>

        {/* SECTION: BUS SERVICES */}
        {(activeTab === 'all' || activeTab === 'bus') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-black flex items-center gap-2">
                  <Bus className="w-6 h-6 text-[#E50914]" />
                  Intercity Bus Routes ({filteredBuses.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Direct connections, verified operators, seat availability, and transparent pricing in INR.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('bus')}
                  className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Buses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredBuses.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No bus routes matching "{filterCity}". Showing all available routes:</p>
                <button
                  onClick={() => setFilterCity('Jaipur')}
                  className="mt-2 text-xs font-bold text-[#E50914] underline"
                >
                  Reset filter to Jaipur / Delhi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBuses.map((bus) => (
                  <BusListingCard
                    key={bus.id}
                    bus={bus}
                    onBook={(item) => handleBookService('BUS', item)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION: TRAIN TIMETABLES */}
        {(activeTab === 'all' || activeTab === 'train') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-black flex items-center gap-2">
                  <Train className="w-6 h-6 text-[#E50914]" />
                  Train Journeys & Schedules ({filteredTrains.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Timetable information and authorized ticket booking integration adapters.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('train')}
                  className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Trains</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredTrains.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No railway journeys matching "{filterCity}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredTrains.map((train) => (
                  <TrainListingCard
                    key={train.id}
                    train={train}
                    onSelectJourney={(item) => handleBookService('TRAIN', item)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION: HOTELS & STAYS */}
        {(activeTab === 'all' || activeTab === 'hotel') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-black flex items-center gap-2">
                  <HotelIcon className="w-6 h-6 text-[#E50914]" />
                  Hotels & Accommodations in {filterCity} ({filteredHotels.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Independent stays with calculated proximity to arrival stations and transparent GST breakdown.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('hotel')}
                  className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Stays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredHotels.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No hotels listed in "{filterCity}". You can add one via the Admin Portal.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHotels.map((hotel) => (
                  <HotelListingCard
                    key={hotel.id}
                    hotel={hotel}
                    onBook={(item) => handleBookService('HOTEL', item)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION: RESTAURANTS & DINING */}
        {(activeTab === 'all' || activeTab === 'restaurant') && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-black flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-[#E50914]" />
                  Curated Dining & Table Reservations in {filterCity} ({filteredRestaurants.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Authentic regional dishes, opening hours, and table slot availability.
                </p>
              </div>

              {activeTab === 'all' && (
                <button
                  onClick={() => setActiveTab('restaurant')}
                  className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Dining</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No restaurants listed in "{filterCity}". Add one via the Admin Portal.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map((rest) => (
                  <RestaurantListingCard
                    key={rest.id}
                    restaurant={rest}
                    onBook={(item, slot) => handleBookService('RESTAURANT', item, slot)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION: DESTINATIONS DIRECTORY (Database-backed Pan-India discovery) */}
        {(activeTab === 'all' || activeTab === 'destinations') && (
          <section className="mb-12">
            <DestinationDirectory
              destinations={destinations}
              selectedCityName={filterCity}
              onSelectDestination={(dest) => {
                setFilterCity(dest.name);
                setActiveDestinationView(dest);
                const elem = document.getElementById('marketplace-results');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </section>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. Independent Booking Modal */}
      {bookingItem && (
        <BookingModal
          serviceType={bookingItem.serviceType}
          item={bookingItem.item}
          currentUser={currentUser}
          initialSlot={bookingItem.initialSlot}
          onClose={() => setBookingItem(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* 2. Bookings Drawer */}
      <BookingsDrawer
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* 3. Admin Management Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        destinations={destinations}
        hotels={hotels}
        restaurants={restaurants}
        auditLogs={auditLogs}
        onRefreshData={reloadData}
      />

      {/* 4. Architecture & Blueprint Specs Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* 5. User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          reloadData();
        }}
      />
    </div>
  );
}
