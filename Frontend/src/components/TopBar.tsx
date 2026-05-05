'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, MapPin, SlidersHorizontal, Check } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { io } from 'socket.io-client';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  locations?: string[];
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFilterClick?: () => void;
}

export default function TopBar({ 
  title, subtitle, showSearch = false,
  locations = [], selectedLocation = '', onLocationChange,
  searchQuery = '', onSearchChange, onFilterClick
}: TopBarProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch initial
      api.get('/notifications').then(res => setNotifications(res.data)).catch(console.error);

      // Listen for new
      const socket = io('http://localhost:3002');
      socket.on(`notification_${user._id}`, (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#1E2430] border-b border-[#322D40] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 lg:ml-64 lg:-mt-0 mt-16">
      
      {/* Left side: Headers or Search */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center">
        {title && (
          <div className="mr-8 mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-[#C8C5C7] text-sm mt-1">{subtitle}</p>}
          </div>
        )}

        {showSearch && (
          <div className="flex flex-1 items-center max-w-2xl gap-3">
            <div className="flex items-center bg-[#322D40] border border-[#322D40] rounded-xl px-4 py-2 hover:border-[#563F7C]/50 transition-colors cursor-pointer relative min-w-[160px]">
              <MapPin className="w-4 h-4 text-[#B3A1C9] mr-2 absolute left-4 pointer-events-none" />
              <select 
                value={selectedLocation} 
                onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
                className="bg-transparent border-none outline-none text-[#C8C5C7] text-sm w-full appearance-none pl-6 pr-4 cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 flex items-center bg-[#322D40] border border-[#322D40] rounded-xl px-4 py-2.5 hover:border-[#563F7C]/50 transition-colors">
              <Search className="w-4 h-4 text-[#C8C5C7] mr-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search properties..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-[#C8C5C7]"
              />
            </div>
            
            <button 
              onClick={onFilterClick}
              className="bg-[#322D40] border border-[#322D40] p-2.5 rounded-xl text-[#C8C5C7] hover:text-white hover:border-[#563F7C]/50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center justify-end space-x-4">
        {user?.role === 'seller' && (
          <Link href="/seller/add" className="bg-[#563F7C] hover:bg-[#4A356A] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#563F7C]/20 transition-all">
            Add Property
          </Link>
        )}
        
        <div className="relative">
          <button 
            className="relative p-2 text-[#C8C5C7] hover:text-white transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#563F7C] rounded-full border-2 border-[#1E2430]"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#322D40] border border-[#1E2430] rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-[#1E2430] flex justify-between items-center bg-[#1E2430]/50">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#563F7C] hover:text-[#B3A1C9] transition-colors font-bold flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="overflow-y-auto flex-1 p-2">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[#C8C5C7] text-sm">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`p-3 mb-2 rounded-xl transition-colors ${!notif.isRead ? 'bg-[#563F7C]/10 border border-[#563F7C]/30 cursor-pointer' : 'hover:bg-[#1E2430] cursor-pointer'}`}
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif._id);
                        if (notif.link) window.location.href = notif.link;
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-white' : 'text-[#C8C5C7]'}`}>{notif.title}</h4>
                        {!notif.isRead && <div className="w-2 h-2 rounded-full bg-[#563F7C] mt-1.5"></div>}
                      </div>
                      <p className={`text-xs ${!notif.isRead ? 'text-[#C8C5C7]' : 'text-[#C8C5C7]/70'}`}>{notif.message}</p>
                      <p className="text-[10px] text-[#C8C5C7]/50 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <Link href={user?.role === 'buyer' ? "/buyer/profile" : "/seller/profile"} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#563F7C] to-[#322D40] border border-[#563F7C] flex items-center justify-center text-white font-bold hover:border-[#B3A1C9] transition-colors cursor-pointer overflow-hidden">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </Link>
      </div>
    </div>
  );
}
