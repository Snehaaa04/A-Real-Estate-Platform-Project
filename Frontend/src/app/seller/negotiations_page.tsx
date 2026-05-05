'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function SellerNegotiations() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/deals');
        setDeals(response.data);
      } catch (error) {
        console.error('Error fetching negotiations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case 'rejected': return <XCircle className="w-4 h-4 mr-1.5" />;
      default: return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="Deal Rooms" 
            subtitle="Manage all active negotiations across your properties"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Active Negotiations</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#322D40] h-24 rounded-2xl border border-[#1E2430]"></div>
                ))}
              </div>
            ) : deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <Link href={`/negotiations/${deal._id}`} key={deal._id} className="block">
                    <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] p-6 hover:border-[#563F7C] transition-all duration-200 shadow-md group flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#1E2430] rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#563F7C]/20 transition-colors">
                          <MessageSquare className="w-6 h-6 text-[#563F7C] group-hover:text-[#B3A1C9]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#B3A1C9] transition-colors">
                            {(deal.property || deal.propertyId)?.title || (deal.property || deal.propertyId)?.propertyType || 'Property'}
                          </h3>
                          <p className="text-sm text-[#C8C5C7]">
                            Current Offer: <span className="font-bold text-white">₹{deal.currentOffer?.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6">
                        <div className={`flex items-center px-3 py-1.5 rounded-lg border text-sm font-bold capitalize ${getStatusColor(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          {deal.status}
                        </div>
                        
                        <div className="text-sm font-bold text-[#563F7C] flex items-center group-hover:text-[#B3A1C9] transition-colors">
                          Enter Room
                          <div className="ml-2 w-8 h-8 rounded-full bg-[#1E2430] flex items-center justify-center">
                            &rarr;
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto flex flex-col items-center mt-12 shadow-lg">
                <div className="w-20 h-20 bg-[#1E2430] rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-10 h-10 text-[#563F7C]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No active negotiations</h3>
                <p className="text-[#C8C5C7]">You do not have any ongoing deals at the moment.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
