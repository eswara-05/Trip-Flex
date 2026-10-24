import React, { useState } from 'react';
import { X, User as UserIcon, Shield, Mail, Lock, Phone, UserCheck, KeyRound } from 'lucide-react';
import { User, UserRole } from '../lib/types';
import { TripFlexStore } from '../lib/store';
import { validateEmail, validateIndianPhone } from '../lib/validators';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserChanged: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (targetRole: UserRole) => {
    const users = TripFlexStore.getUsers();
    const found = users.find((u) => u.role === targetRole) || {
      id: 'usr-' + targetRole.toLowerCase(),
      email: `${targetRole.toLowerCase()}@tripflex.in`,
      name: `${targetRole} Demo Account`,
      role: targetRole,
      createdAt: new Date().toISOString(),
    };
    TripFlexStore.setCurrentUser(found);
    onUserChanged(found);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'REGISTER') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (phone && !validateIndianPhone(phone)) {
        setError('Please enter a valid 10-digit Indian mobile number.');
        return;
      }

      const newUser: User = {
        id: 'usr-' + Date.now(),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role,
        phone: phone.trim(),
        createdAt: new Date().toISOString(),
      };

      const existingUsers = TripFlexStore.getUsers();
      existingUsers.push(newUser);
      TripFlexStore.saveUsers(existingUsers);
      TripFlexStore.setCurrentUser(newUser);
      onUserChanged(newUser);
      onClose();
    } else {
      // Find or create customer
      const existingUsers = TripFlexStore.getUsers();
      let user = existingUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        user = {
          id: 'usr-' + Date.now(),
          email: email.trim().toLowerCase(),
          name: email.split('@')[0],
          role: 'CUSTOMER',
          createdAt: new Date().toISOString(),
        };
        existingUsers.push(user);
        TripFlexStore.saveUsers(existingUsers);
      }
      TripFlexStore.setCurrentUser(user);
      onUserChanged(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bold text-white text-sm">
              TF
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white">
                Trip Flex Authentication
              </h3>
              <p className="text-[11px] text-gray-400">
                {mode === 'LOGIN' ? 'Sign in to access your bookings' : 'Create a new marketplace profile'}
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

        {/* Content */}
        <div className="p-6">
          {/* Quick Demo Switcher */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl mb-5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
              ⚡ Instant Test Account Switcher:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-red-100 text-red-800 hover:bg-red-200 border border-red-300 transition cursor-pointer"
              >
                Admin (Dev)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('CUSTOMER')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 transition cursor-pointer"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('PROVIDER')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 transition cursor-pointer"
              >
                Provider
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. arjun.sharma@gmail.com"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (India)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Account Type</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-black focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="CUSTOMER">Customer (Traveller)</option>
                    <option value="PROVIDER">Service Provider (Bus / Hotel / Dining)</option>
                    <option value="ADMIN">Platform Administrator</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs shadow-md transition cursor-pointer mt-2"
            >
              {mode === 'LOGIN' ? 'Sign In' : 'Create Trip Flex Account'}
            </button>
          </form>

          {/* Switch Login/Register */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
            {mode === 'LOGIN' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('REGISTER')}
                  className="font-bold text-[#E50914] hover:underline cursor-pointer"
                >
                  Register now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="font-bold text-[#E50914] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
