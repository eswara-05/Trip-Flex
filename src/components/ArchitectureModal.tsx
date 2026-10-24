import React, { useState } from 'react';
import { X, Database, Layers, CheckCircle2, ShieldCheck, MapPin, Network, Code, Server, FileText, CreditCard } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'erd' | 'arch' | 'milestones' | 'payments_arch'>('erd');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-4xl w-full shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-700/60 text-[#E50914]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                Trip Flex Architecture & Relational Database Blueprint
              </h3>
              <p className="text-xs text-gray-400">
                Milestone 1 Foundation Specification & Entity-Relationship Model
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="bg-[#1C1C1C] px-5 py-2.5 flex items-center gap-2 border-b border-gray-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'erd' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database ER Diagram & Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('payments_arch')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'payments_arch' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Razorpay Payment & Webhook Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('arch')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'arch' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>System Architecture & Page Map</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'milestones' ? 'bg-[#E50914] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acceptance Criteria Status</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#F7F7F7] text-xs space-y-6">
          {activeTab === 'erd' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-heading font-extrabold text-base text-black mb-1">
                  Relational Database Entity-Relationship Design (MySQL / Django ORM)
                </h4>
                <p className="text-gray-600 mb-4">
                  Normalized database schema enforcing relational integrity, explicit decimal currency (INR), foreign keys, indexes, and source-level auditing.
                </p>

                {/* Relational Table Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Users Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>users_user</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: UUID / INT AUTO_INCREMENT</li>
                      <li>email: VARCHAR(255) UNIQUE NOT NULL</li>
                      <li>password_hash: VARCHAR(255)</li>
                      <li>role: ENUM('ADMIN', 'PROVIDER', 'CUSTOMER', 'STAFF')</li>
                      <li>phone: VARCHAR(20)</li>
                      <li>is_verified: BOOLEAN DEFAULT FALSE</li>
                      <li>created_at: DATETIME (CURRENT_TIMESTAMP)</li>
                    </ul>
                  </div>

                  {/* Destination Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>geo_destination</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64) PRIMARY KEY</li>
                      <li>name: VARCHAR(100) INDEX</li>
                      <li>state: VARCHAR(100)</li>
                      <li>latitude: DECIMAL(10, 7)</li>
                      <li>longitude: DECIMAL(10, 7)</li>
                      <li>source_type: ENUM('ADMIN_MANAGED', 'DEV_SAMPLE')</li>
                      <li>is_active: BOOLEAN DEFAULT TRUE</li>
                    </ul>
                  </div>

                  {/* Bus Service Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>transport_busservice</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64)</li>
                      <li>operator_name: VARCHAR(150)</li>
                      <li>origin_city: VARCHAR(100) INDEX</li>
                      <li>destination_city: VARCHAR(100) INDEX</li>
                      <li>departure_time: TIME</li>
                      <li>arrival_time: TIME</li>
                      <li>base_fare_inr: DECIMAL(10, 2)</li>
                      <li>available_seats: INT UNSIGNED</li>
                      <li>source_type: ENUM('ADMIN_MANAGED', 'AUTHORIZED_PROVIDER', 'DEV_SAMPLE')</li>
                      <li><strong className="text-purple-600">FK</strong> provider_id: users_user.id (Nullable)</li>
                    </ul>
                  </div>

                  {/* Train Timetable Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>transport_trainjourney</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64)</li>
                      <li>train_number: VARCHAR(20) INDEX</li>
                      <li>train_name: VARCHAR(150)</li>
                      <li>origin_code: VARCHAR(10)</li>
                      <li>destination_code: VARCHAR(10)</li>
                      <li>runs_on_days: JSON</li>
                      <li>authorized_integration: BOOLEAN DEFAULT FALSE</li>
                      <li>source_note: TEXT</li>
                    </ul>
                  </div>

                  {/* Hotel Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>stay_hotel</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64)</li>
                      <li>name: VARCHAR(150)</li>
                      <li>city: VARCHAR(100) INDEX</li>
                      <li>latitude / longitude: DECIMAL(10, 7)</li>
                      <li>star_rating: TINYINT</li>
                      <li>starting_price_inr: DECIMAL(10, 2)</li>
                      <li>verified: BOOLEAN DEFAULT FALSE</li>
                      <li>source_type: ENUM('ADMIN_MANAGED', 'AUTHORIZED_PROVIDER', 'DEV_SAMPLE')</li>
                    </ul>
                  </div>

                  {/* Restaurant Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>dining_restaurant</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <ul className="space-y-1 font-mono text-[11px] text-gray-700">
                      <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64)</li>
                      <li>name: VARCHAR(150)</li>
                      <li>city: VARCHAR(100) INDEX</li>
                      <li>cuisine: JSON</li>
                      <li>cost_for_two_inr: DECIMAL(10, 2)</li>
                      <li>max_capacity_per_slot: INT UNSIGNED</li>
                      <li>verified: BOOLEAN DEFAULT FALSE</li>
                      <li>source_type: ENUM('ADMIN_MANAGED', 'DEV_SAMPLE')</li>
                    </ul>
                  </div>

                  {/* Booking Table */}
                  <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm md:col-span-2">
                    <div className="font-mono font-bold text-sm text-[#E50914] border-b pb-1 mb-2 flex items-center justify-between">
                      <span>booking_reservation</span>
                      <span className="text-[10px] text-gray-500 font-normal">Table</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-gray-700">
                      <div>
                        <li><strong className="text-blue-600">PK</strong> id: VARCHAR(64)</li>
                        <li>booking_reference: VARCHAR(50) UNIQUE INDEX</li>
                        <li><strong className="text-purple-600">FK</strong> user_id: users_user.id</li>
                        <li>service_type: ENUM('BUS', 'TRAIN', 'HOTEL', 'RESTAURANT')</li>
                        <li>service_id: VARCHAR(64)</li>
                      </div>
                      <div>
                        <li>base_amount: DECIMAL(10, 2)</li>
                        <li>gst_amount: DECIMAL(10, 2)</li>
                        <li>platform_fee: DECIMAL(10, 2)</li>
                        <li>total_amount: DECIMAL(10, 2)</li>
                        <li>status: ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED')</li>
                        <li>created_at: DATETIME (CURRENT_TIMESTAMP)</li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments_arch' && (
            <div className="space-y-4">
              <h4 className="font-heading font-extrabold text-base text-black mb-1">
                Razorpay Payment Gateway, Webhooks & Compensation Architecture
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Production-grade payment processing tailored for Indian financial compliance (RBI Tokenization, GST calculations, INR currency, and idempotent webhooks).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-300">
                  <h5 className="font-bold text-[#E50914] text-xs uppercase mb-2">1. Seven-Step Payment Lifecycle</h5>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-gray-700">
                    <li><strong>Booking Intent:</strong> Traveller picks seats/stay dates; zero client price trust.</li>
                    <li><strong>Server Revalidation:</strong> Server calculates GST (5%/12%) + ₹20 platform fee.</li>
                    <li><strong>Order Creation:</strong> Server invokes <code>/api/payments/create-order</code> to generate <code>order_...</code> with idempotency key.</li>
                    <li><strong>Gateway Checkout:</strong> Razorpay Indian checkout handles UPI (VPA), Tokenized Cards, or NetBanking.</li>
                    <li><strong>Signature Verification:</strong> Server authenticates HMAC SHA-256 signature <code>(order_id + '|' + payment_id)</code>.</li>
                    <li><strong>Provider Fulfillment:</strong> Reservation marked <code>CONFIRMED</code> only upon provider confirmation.</li>
                    <li><strong>Compensation / Refund:</strong> If provider fails to confirm, automated refund <code>rfnd_...</code> is triggered.</li>
                  </ol>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-300">
                  <h5 className="font-bold text-[#E50914] text-xs uppercase mb-2">2. Webhook & Security Guarantees</h5>
                  <ul className="space-y-2 text-[11px] text-gray-700">
                    <li>
                      <strong>Idempotent Processing:</strong> All webhook event IDs (<code>payment.captured</code>, <code>payment.failed</code>) are tracked in the database to prevent duplicate status changes or double refunds.
                    </li>
                    <li>
                      <strong>HMAC SHA-256 Signatures:</strong> Webhook body verified with <code>X-Razorpay-Signature</code> using secret key.
                    </li>
                    <li>
                      <strong>Zero Raw Card Storage:</strong> No raw card numbers or CVVs stored; strictly compliant with PCI-DSS & RBI tokenization norms.
                    </li>
                    <li>
                      <strong>Configuration:</strong> Configured via <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in <code>.env</code>. Includes built-in test sandbox simulator.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4">
              <h4 className="font-heading font-extrabold text-base text-black mb-1">
                Trip Flex Layered Architecture & Page Map
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Trip Flex is architected around independent service selection, loose coupling, server-side data integrity, and strict anti-slop principles.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-white rounded-lg border border-gray-300">
                  <div className="font-bold text-[#E50914] mb-1">1. Presentation Layer (Red-Black-White System)</div>
                  <div className="text-gray-700">
                    Header & Global Nav • Search Hero with Tabbed Service Switcher • Service-Specific Listing Cards • Destination Discovery Hub • Booking Checkout Modal • Bookings History Drawer • Admin Management Portal.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-300">
                  <div className="font-bold text-[#E50914] mb-1">2. Core Domain & Business Logic (Pure Decoupled Modules)</div>
                  <div className="text-gray-700">
                    • <strong>geo.ts:</strong> Haversine straight-line distance calculations in km.<br />
                    • <strong>pricing.ts:</strong> Transparent GST tax computation (5% transport, 12% stay) + ₹20 platform fee.<br />
                    • <strong>validators.ts:</strong> Indian phone validation (+91), email regex, check-in & check-out dates, state transition machine.<br />
                    • <strong>store.ts:</strong> LocalStorage persistent repository with seed datasets.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-300">
                  <div className="font-bold text-[#E50914] mb-1">3. External Integration Adapters (Phase C/D Ready)</div>
                  <div className="text-gray-700">
                    • <strong>IRCTC / CRIS Adapter:</strong> Ready for railway booking integration.<br />
                    • <strong>Bus GDS Adapter:</strong> For live seat layouts and operator sync.<br />
                    • <strong>Payment Gateway (Razorpay/Stripe):</strong> 7-step compensation and refund workflow.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h4 className="font-heading font-extrabold text-base text-black mb-1">
                Milestone 1 — Foundation Acceptance Status
              </h4>
              <div className="space-y-2">
                {[
                  { text: 'Concise architecture and page map documented', status: true },
                  { text: 'Database entity-relationship design with normalized tables & foreign keys', status: true },
                  { text: 'Red, black, and white design system (#E50914, #B20710, #111111, #FFFFFF)', status: true },
                  { text: 'Responsive shared layout with Header, Footer, and Navigation', status: true },
                  { text: 'User accounts with Role Switching (Admin, Customer, Provider) for testing', status: true },
                  { text: 'Admin-managed destinations, hotels, and restaurants with CRUD & verification toggle', status: true },
                  { text: 'Clearly labelled data sources: ADMIN_MANAGED, AUTHORIZED_PROVIDER, DEV_SAMPLE', status: true },
                  { text: 'Destination discovery showing nearby hotels and restaurants using Haversine calculation', status: true },
                  { text: 'Automated unit tests covering distance math, GST pricing, validators, and state machine', status: true },
                  { text: 'Zero AI / LLM / chatbot hallucinations — conventional database & logic only', status: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-gray-800">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-700 leading-relaxed">
                <strong>Next Planned Step (Milestone 2):</strong> Provider Onboarding Workflow, Provider Inventory Dashboard, Reservation Fulfilment state management, and Live Booking Status compensation hooks.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
