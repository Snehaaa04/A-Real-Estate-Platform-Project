'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Heart, MessageSquare, User, LogOut, Briefcase, Plus, Menu, X, Inbox } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  if (!user) return null;

  const closeSidebar = () => setIsOpen(false);

  const activeClasses = "bg-[#563F7C] text-white shadow-lg shadow-[#563F7C]/20";
  const inactiveClasses = "text-[#C8C5C7] hover:text-white hover:bg-[#1E2430]";

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#322D40] border-b border-[#1E2430] z-50 flex items-center justify-between px-4">
        <Logo onClick={closeSidebar} />
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#322D40] border-r border-[#1E2430] z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-[#1E2430]">
          <Logo onClick={closeSidebar} />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-bold text-[#C8C5C7] uppercase tracking-wider mb-4 px-2">Menu</div>
          
          {user.role === 'buyer' ? (
            <>
              <Link href="/buyer/dashboard" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/dashboard') ? activeClasses : inactiveClasses}`}>
                <Home className={`w-5 h-5 mr-3 ${isActive('/buyer/dashboard') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Dashboard</span>
              </Link>
              <Link href="/buyer/saved-properties" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/saved-properties') ? activeClasses : inactiveClasses}`}>
                <Heart className={`w-5 h-5 mr-3 ${isActive('/buyer/saved-properties') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Saved Properties</span>
              </Link>
              <Link href="/buyer/negotiations" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/negotiations') ? activeClasses : inactiveClasses}`}>
                <MessageSquare className={`w-5 h-5 mr-3 ${isActive('/buyer/negotiations') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Negotiations</span>
              </Link>
              <Link href="/buyer/requests" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/requests') ? activeClasses : inactiveClasses}`}>
                <Inbox className={`w-5 h-5 mr-3 ${isActive('/buyer/requests') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">My Requests</span>
              </Link>
              <Link href="/buyer/my-properties" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/my-properties') ? activeClasses : inactiveClasses}`}>
                <Briefcase className={`w-5 h-5 mr-3 ${isActive('/buyer/my-properties') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">My Properties</span>
              </Link>
              
              <div className="mt-8 mb-4 px-2">
                <div className="h-px w-full bg-[#1E2430]"></div>
              </div>

              <Link href="/buyer/profile" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/buyer/profile') ? activeClasses : inactiveClasses}`}>
                <User className={`w-5 h-5 mr-3 ${isActive('/buyer/profile') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/seller/dashboard" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/dashboard') ? activeClasses : inactiveClasses}`}>
                <Home className={`w-5 h-5 mr-3 ${isActive('/seller/dashboard') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Dashboard</span>
              </Link>
              <Link href="/seller/listings" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/listings') ? activeClasses : inactiveClasses}`}>
                <Briefcase className={`w-5 h-5 mr-3 ${isActive('/seller/listings') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">My Listings</span>
              </Link>
              <Link href="/seller/add" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/add') ? activeClasses : inactiveClasses}`}>
                <Plus className={`w-5 h-5 mr-3 ${isActive('/seller/add') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Add Property</span>
              </Link>
              <Link href="/seller/requests" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/requests') ? activeClasses : inactiveClasses}`}>
                <Inbox className={`w-5 h-5 mr-3 ${isActive('/seller/requests') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Buyer Requests</span>
              </Link>
              <Link href="/seller/negotiations" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/negotiations') ? activeClasses : inactiveClasses}`}>
                <MessageSquare className={`w-5 h-5 mr-3 ${isActive('/seller/negotiations') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Negotiations</span>
              </Link>
              
              <div className="mt-8 mb-4 px-2">
                <div className="h-px w-full bg-[#1E2430]"></div>
              </div>

              <Link href="/seller/profile" onClick={closeSidebar} className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/seller/profile') ? activeClasses : inactiveClasses}`}>
                <User className={`w-5 h-5 mr-3 ${isActive('/seller/profile') ? 'text-white' : 'text-[#C8C5C7]'}`} />
                <span className="font-semibold">Profile</span>
              </Link>
            </>
          )}

        </div>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-[#1E2430]">
          <button 
            onClick={() => { logout(); closeSidebar(); }} 
            className="flex items-center w-full px-4 py-3 rounded-xl text-[#C8C5C7] hover:text-red-400 hover:bg-[#1E2430] transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
