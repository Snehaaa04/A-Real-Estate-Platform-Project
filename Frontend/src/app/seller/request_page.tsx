'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, Check, X, Mail, Phone, Home } from 'lucide-react';

export default function SellerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/seller');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'accepted' | 'rejected') => {
    setActionLoading(id);
    try {
      const res = await api.patch(`/requests/${id}/status`, { status });
      setRequests(requests.map(req => req._id === id ? res.data : req));
    } catch (error) {
      console.error(`Error updating request to ${status}`, error);
      alert('Failed to update request');
    } finally {
      setActionLoading(null);
    }
  };

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
            title="Buyer Requests" 
            subtitle="Manage incoming requests to buy or rent your properties"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Incoming Requests</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#322D40] h-40 rounded-2xl border border-[#1E2430]"></div>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req) => (
                  <div key={req._id} className="bg-[#322D40] rounded-2xl border border-[#1E2430] p-6 shadow-md flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.type === 'buy' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                        {req.type} Request
                      </span>
                      <div className={`flex items-center px-2 py-1 rounded border text-xs font-bold capitalize ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                        {req.status}
                      </div>
                    </div>
                    
                    <Link href={`/properties/${req.propertyId?._id}`} className="block group mb-4 border-b border-[#1E2430] pb-4">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#563F7C] transition-colors line-clamp-1">
                        {req.propertyId?.title || 'Unknown Property'}
                      </h3>
                      <p className="text-xs text-[#C8C5C7] flex items-center">
                        <Home className="w-3 h-3 mr-1" />
                        {req.propertyId?.location || 'Unknown Location'}, {req.propertyId?.city || 'Unknown City'}
                      </p>
                    </Link>
                    
                    <div className="flex-1">
                      <p className="text-xs text-[#C8C5C7]/70 mb-2">Buyer Details</p>
                      <div className="bg-[#1E2430] rounded-xl p-3 border border-[#1E2430] mb-4">
                        <div className="flex items-center text-sm text-white font-bold mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#563F7C] flex items-center justify-center mr-2 text-[10px]">
                            {req.buyerId?.name?.charAt(0) || 'B'}
                          </div>
                          {req.buyerId?.name || 'Unknown Buyer'}
                        </div>
                        {req.status === 'accepted' && (
                          <div className="flex flex-col gap-1 mt-2 text-xs text-[#C8C5C7]">
                            <span className="flex items-center"><Mail className="w-3 h-3 mr-2" /> {req.buyerId?.email || 'No email provided'}</span>
                            {req.buyerId?.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-2" /> {req.buyerId?.phone}</span>}
                          </div>
                        )}
                      </div>
                      
                      {req.message && (
                        <div className="mb-4">
                          <p className="text-xs text-[#C8C5C7]/70 mb-1">Message</p>
                          <p className="text-sm text-white italic">"{req.message}"</p>
                        </div>
                      )}
                    </div>
                    
                    {req.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1E2430]">
                        <button
                          onClick={() => handleAction(req._id, 'accepted')}
                          disabled={actionLoading === req._id}
                          className="flex items-center justify-center py-2 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'rejected')}
                          disabled={actionLoading === req._id}
                          className="flex items-center justify-center py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </div>
                    )}
                    
                    {req.status !== 'pending' && (
                      <div className="mt-4 pt-4 border-t border-[#1E2430] text-center text-xs text-[#C8C5C7]/70">
                        {req.status === 'accepted' ? 'You have accepted this request. The buyer will contact you.' : 'You have rejected this request.'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto flex flex-col items-center mt-12 shadow-lg">
                <div className="w-20 h-20 bg-[#1E2430] rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-[#563F7C]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No incoming requests</h3>
                <p className="text-[#C8C5C7]">Buyers haven't submitted any buy or rent requests yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
