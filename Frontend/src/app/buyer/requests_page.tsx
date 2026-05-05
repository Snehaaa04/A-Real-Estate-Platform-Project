'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, Home, Mail } from 'lucide-react';

export default function BuyerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/buyer');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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
    <ProtectedRoute allowedRoles={['buyer']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="My Requests" 
            subtitle="Track your Buy and Rent requests"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Sent Requests</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#322D40] h-32 rounded-2xl border border-[#1E2430]"></div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requests.map((req) => (
                  <div key={req._id} className="bg-[#322D40] rounded-2xl border border-[#1E2430] p-6 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.type === 'buy' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                          {req.type} Request
                        </span>
                        <div className={`flex items-center px-2 py-1 rounded border text-xs font-bold capitalize ${getStatusColor(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </div>
                      </div>
                      
                      <Link href={`/properties/${req.propertyId?._id}`} className="block group">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#563F7C] transition-colors line-clamp-1">
                          {req.propertyId?.title || 'Unknown Property'}
                        </h3>
                        <p className="text-sm text-[#C8C5C7] flex items-center mb-4">
                          <Home className="w-3 h-3 mr-1" />
                          {req.propertyId?.location || 'Unknown Location'}, {req.propertyId?.city || 'Unknown City'}
                        </p>
                      </Link>
                      
                      {req.message && (
                        <div className="bg-[#1E2430] p-3 rounded-xl border border-[#1E2430] mb-4">
                          <p className="text-xs text-[#C8C5C7] italic">"{req.message}"</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-[#1E2430] pt-4 mt-2">
                      <p className="text-xs text-[#C8C5C7]/70 mb-1">Seller Details</p>
                      <div className="flex items-center text-sm text-white font-medium">
                        <div className="w-6 h-6 rounded-full bg-[#563F7C] flex items-center justify-center mr-2 text-[10px]">
                          {req.sellerId?.name?.charAt(0) || 'S'}
                        </div>
                        {req.sellerId?.name || 'Unknown Seller'}
                        {req.status === 'accepted' && req.sellerId?.email && (
                          <a href={`mailto:${req.sellerId.email}`} className="ml-auto text-[#563F7C] hover:text-[#B3A1C9]">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto flex flex-col items-center mt-12 shadow-lg">
                <div className="w-20 h-20 bg-[#1E2430] rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-[#563F7C]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No requests sent</h3>
                <p className="text-[#C8C5C7]">You haven't requested to buy or rent any properties yet.</p>
                <Link href="/buyer/dashboard" className="mt-6 px-6 py-2 bg-[#563F7C] text-white rounded-xl font-bold hover:bg-[#4A356A] transition-colors">
                  Browse Properties
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
