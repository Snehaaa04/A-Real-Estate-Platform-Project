'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyCard from '@/components/PropertyCard';
import api from '@/lib/api';
import Link from 'next/link';
import { Home, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, propsRes] = await Promise.all([
          api.get('/properties/seller/analytics'),
          api.get('/properties/seller/my-properties')
        ]);
        setAnalytics(analyticsRes.data);
        setProperties(propsRes.data);
      } catch (error) {
        console.error('Error fetching seller data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="Seller Overview" 
            subtitle="Manage your premium real estate portfolio"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#322D40] p-6 rounded-3xl border border-[#1E2430] shadow-lg flex items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#563F7C]/20 flex items-center justify-center mr-4 border border-[#563F7C]/30">
                  <Home className="w-7 h-7 text-[#B3A1C9]" />
                </div>
                <div>
                  <p className="text-[#C8C5C7] text-sm font-bold uppercase tracking-wider mb-1">Active Listings</p>
                  <h3 className="text-3xl font-extrabold text-white">{loading ? '-' : analytics?.summary?.activeProperties}</h3>
                </div>
              </div>
              
              <div className="bg-[#322D40] p-6 rounded-3xl border border-[#1E2430] shadow-lg flex items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20">
                  <TrendingUp className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <p className="text-[#C8C5C7] text-sm font-bold uppercase tracking-wider mb-1">Total Portfolio Value</p>
                  <h3 className="text-3xl font-extrabold text-white">{loading ? '-' : `₹${(analytics?.summary?.totalValue / 10000000).toFixed(2)} Cr`}</h3>
                </div>
              </div>
              
              <div className="bg-[#322D40] p-6 rounded-3xl border border-[#1E2430] shadow-lg flex items-center">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mr-4 border border-green-500/20">
                  <Users className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-[#C8C5C7] text-sm font-bold uppercase tracking-wider mb-1">Sold Properties</p>
                  <h3 className="text-3xl font-extrabold text-white">{loading ? '-' : analytics?.summary?.soldProperties}</h3>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-10 bg-[#322D40] p-6 rounded-3xl border border-[#1E2430] shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6">Profile Views & Inquiries (Last 7 Days)</h2>
              <div className="h-80 w-full">
                {loading ? (
                  <div className="w-full h-full animate-pulse bg-[#1E2430] rounded-xl"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.viewsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#563F7C" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#563F7C" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#C8C5C7" />
                      <YAxis stroke="#C8C5C7" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2430" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1E2430', borderColor: '#322D40', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#563F7C" fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="inquiries" stroke="#4ade80" fillOpacity={1} fill="url(#colorInquiries)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Listings Preview */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Top Listings Snapshot</h2>
              <Link href="/seller/listings" className="text-[#B3A1C9] hover:text-white text-sm font-bold flex items-center transition-colors">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#322D40] h-80 rounded-2xl border border-[#1E2430]"></div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 3).map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto shadow-lg">
                <div className="w-20 h-20 bg-[#1E2430] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-[#563F7C]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No properties listed</h3>
                <p className="text-[#C8C5C7] mb-6">Add your first premium listing to start receiving offers.</p>
                <Link href="/seller/add" className="bg-[#563F7C] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4A356A] transition-colors inline-block shadow-md shadow-[#563F7C]/20">
                  Add Property Now
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
