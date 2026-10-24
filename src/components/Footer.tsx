import React from 'react';
import { Shield, MapPin, IndianRupee, HeartHandshake, PhoneCall, AlertCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-[#222222] mt-16">
      {/* Brand & Guarantee ribbon */}
      <div className="bg-[#1C1C1C] border-b border-[#2a2a2a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-950/40 text-[#E50914] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Independent Bookings</h4>
              <p className="text-xs text-gray-400">Book only what you need. Zero forced bundling or compulsory package lock-ins.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-950/40 text-[#E50914] shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Transparent Pricing</h4>
              <p className="text-xs text-gray-400">All prices in Indian Rupees (INR). Explicit base fares, GST breakdown, zero hidden markups.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-950/40 text-[#E50914] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Destination Discovery</h4>
              <p className="text-xs text-gray-400">Arrive by bus or train, instantly discover verified hotels and restaurants nearby.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-950/40 text-[#E50914] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Verified Operators</h4>
              <p className="text-xs text-gray-400">Clear audit trail distinguishing admin listings, provider feeds, and dev sample data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-white font-extrabold text-sm">
                TF
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                TRIP <span className="text-[#E50914]">FLEX</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4 max-w-sm">
              Trip Flex is a modern Indian travel marketplace connecting travellers with independent bus operators, train journeys, verified hotels, and curated restaurants. Built with privacy-first architecture and transparent pricing.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#1C1C1C] p-2.5 rounded-lg border border-gray-800">
              <PhoneCall className="w-4 h-4 text-[#E50914] shrink-0" />
              <span>Traveller Support Desk: <strong className="text-white">+91 1800-TRIP-FLEX</strong> (24x7)</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Travel Services</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition">Intercity Sleeper & Volvo Buses</li>
              <li className="hover:text-white transition">Vande Bharat & Express Trains</li>
              <li className="hover:text-white transition">Heritage Haveli & Boutique Stays</li>
              <li className="hover:text-white transition">Regional & Fine Dining Reservations</li>
              <li className="hover:text-white transition">Transit-Hub Proximity Search</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Top Hubs (India)</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition">Jaipur, Rajasthan (Sindhi Camp / JP)</li>
              <li className="hover:text-white transition">Goa (Madgaon MAO / Panaji KTC)</li>
              <li className="hover:text-white transition">Manali, Himachal (Mall Road)</li>
              <li className="hover:text-white transition">New Delhi (Kashmere Gate / NDLS)</li>
              <li className="hover:text-white transition">Varanasi, UP (Cantt / BSB)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform Integrity</h5>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Milestone 1 Foundation Active</span>
              </div>
              <p className="text-[11px] leading-tight text-gray-500">
                Live IRCTC & payment gateway integrations are scheduled for Phase C/D per the technical specification roadmap.
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block font-medium">Currency Standard:</span>
                <span className="text-xs font-semibold text-white">Indian Rupee (INR ₹)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="border-t border-[#222222] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Trip Flex Marketplace India. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="hover:text-white">Security & Audit</span>
            <span className="hover:text-white">Cancellation & Refund Policy</span>
            <span className="hover:text-white">Provider Code of Conduct</span>
            <span className="hover:text-white">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
