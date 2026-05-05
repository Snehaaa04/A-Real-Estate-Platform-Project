'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyCard from '@/components/PropertyCard';
import api from '@/lib/api';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function SellerListings() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties/seller/my-properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching seller properties', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="My Listings" 
            subtitle="Manage your complete property portfolio"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">All Properties</h2>
              <div className="text-sm font-medium text-[#C8C5C7]">
                {properties.length} {properties.length === 1 ? 'listing' : 'listings'} total
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-[#322D40] h-96 rounded-2xl border border-[#1E2430] flex flex-col">
                    <div className="h-56 bg-[#1E2430] rounded-t-2xl"></div>
                    <div className="p-5 space-y-4 flex-1">
                      <div className="h-6 bg-[#1E2430] rounded w-3/4"></div>
                      <div className="h-4 bg-[#1E2430] rounded w-1/2"></div>
                      <div className="h-4 bg-[#1E2430] rounded w-full mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto flex flex-col items-center mt-12 shadow-lg">
                <div className="w-24 h-24 bg-[#1E2430] rounded-full flex items-center justify-center mb-6">
                  <Home className="w-12 h-12 text-[#563F7C]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No properties listed</h3>
                <p className="text-[#C8C5C7] text-lg mb-8">Add your premium properties to start receiving offers.</p>
                <Link href="/seller/add" className="bg-[#563F7C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4A356A] transition-colors shadow-md shadow-[#563F7C]/20">
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
