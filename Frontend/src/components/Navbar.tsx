'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home, User, Heart, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-[#1E2430] shadow-lg border-b border-[#1E2430] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Clear <span className="text-[#563F7C]">Estate</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <>
                    <Link 
                      href="/buyer/dashboard" 
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${isActive('/buyer/dashboard') ? 'bg-[#322D40] text-[#563F7C]' : 'text-[#C8C5C7] hover:text-white hover:bg-[#322D40]'}`}
                    >
                      <Home className="w-4 h-4 mr-1.5" />
                      Browse
                    </Link>
                    <Link 
                      href="/buyer/saved-properties" 
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${isActive('/buyer/saved-properties') ? 'bg-[#322D40] text-[#563F7C]' : 'text-[#C8C5C7] hover:text-white hover:bg-[#322D40]'}`}
                    >
                      <Heart className="w-4 h-4 mr-1.5" />
                      Saved
                    </Link>
                  </>
                )}
                {user.role === 'seller' && (
                  <>
                    <Link 
                      href="/seller/dashboard" 
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${isActive('/seller/dashboard') ? 'bg-[#322D40] text-[#563F7C]' : 'text-[#C8C5C7] hover:text-white hover:bg-[#322D40]'}`}
                    >
                      <Briefcase className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Link>
                  </>
                )}
                
                <div className="flex items-center ml-2 sm:ml-4 border-l border-[#322D40] pl-2 sm:pl-4 space-x-2">
                  <Link 
                    href="/profile" 
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive('/profile') ? 'text-[#563F7C]' : 'text-[#C8C5C7] hover:text-white'}`}
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-[#C8C5C7] hover:text-red-500 transition-colors rounded-md hover:bg-[#322D40]"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1.5">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#C8C5C7] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="bg-[#563F7C] text-white hover:bg-[#4A356A] px-5 py-2 rounded-md text-sm font-bold transition-colors shadow-md shadow-[#563F7C]/20">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
