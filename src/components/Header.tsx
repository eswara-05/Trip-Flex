import React from 'react';
import { Compass, ShieldCheck, Ticket, User as UserIcon, BookOpen, Database, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../lib/types';

interface HeaderProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onOpenBookings: () => void;
  onOpenAdmin: () => void;
  onOpenArchitecture: () => void;
  bookingCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onOpenAuth,
  onOpenBookings,
  onOpenAdmin,
  onOpenArchitecture,
  bookingCount,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white border-b border-[#2a2a2a] shadow-md">
      {/* Top micro banner */}
      <div className="bg-[#B20710] text-xs py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>TRIP FLEX MARKETPLACE — Independent Bookings for Bus, Train, Hotel & Dining in India</span>
        <span className="hidden md:inline text-white/80">| All Prices in INR (₹)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('all')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
                TF
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center">
                  TRIP <span className="text-[#E50914] ml-1">FLEX</span>
                </span>
                <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">
                  Travel Marketplace
                </span>
              </div>
            </button>

            {/* Navigation tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'bus', label: 'Buses' },
                { id: 'train', label: 'Trains' },
                { id: 'hotel', label: 'Hotels' },
                { id: 'restaurant', label: 'Restaurants' },
                { id: 'destinations', label: 'Destinations' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#E50914] text-white font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-[#1C1C1C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Architecture & DB Blueprint button */}
            <button
              onClick={onOpenArchitecture}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#1C1C1C] hover:bg-[#282828] text-gray-200 border border-gray-700 transition cursor-pointer"
              title="View Database Architecture, ER Diagram & Milestone 1 Specs"
            >
              <Database className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Blueprint & Specs</span>
            </button>

            {/* Admin Management (if admin role or switchable) */}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-950/80 text-red-200 border border-red-700/60 hover:bg-red-900 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="hidden sm:inline">Admin</span> Portal
              </button>
            )}

            {/* My Bookings */}
            <button
              onClick={onOpenBookings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#1C1C1C] hover:bg-[#282828] text-white border border-gray-700 transition relative cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="hidden sm:inline">My</span> Bookings
              {bookingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E50914] text-white font-bold">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* User Account / Role Switcher dropdown */}
            <div className="relative group">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1C1C1C] hover:bg-[#262626] border border-gray-700 text-xs transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center font-bold text-white text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-white leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.role === 'ADMIN'
                      ? 'text-red-400'
                      : currentUser.role === 'PROVIDER'
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-gray-800 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'bus', label: 'Buses' },
            { id: 'train', label: 'Trains' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'restaurant', label: 'Dining' },
            { id: 'destinations', label: 'Destinations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#E50914] text-white font-medium'
                  : 'bg-[#1C1C1C] text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
