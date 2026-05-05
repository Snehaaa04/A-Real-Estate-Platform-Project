'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Send, Check, X, RefreshCw, Home, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NegotiationRoom() {
  const { dealId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Offer state
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await api.get(`/deals/${dealId}`);
        setDeal(res.data);
      } catch (error) {
        console.error('Error fetching deal', error);
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchDeal();
    }
  }, [dealId]);

  useEffect(() => {
    if (socket && dealId) {
      socket.emit('join_deal', dealId);

      socket.on('receive_message', (message: any) => {
        setDeal((prev: any) => ({
          ...prev,
          messages: [...prev.messages, message]
        }));
      });

      socket.on('deal_updated', (updatedDeal: any) => {
        api.get(`/deals/${dealId}`).then(res => setDeal(res.data));
      });

      return () => {
        socket.emit('leave_deal', dealId);
        socket.off('receive_message');
        socket.off('deal_updated');
      };
    }
  }, [socket, dealId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deal?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const res = await api.post(`/deals/${dealId}/messages`, { content: newMessage });
      setDeal(res.data); 
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleOfferAction = async (offerId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/deals/${dealId}/offers/${offerId}/status`, { status });
      setDeal(res.data);
    } catch (error) {
      console.error(`Error updating offer status to ${status}`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post(`/deals/${dealId}/offers`, {
        amount: Number(counterAmount),
        note: counterNote
      });
      setDeal(res.data);
      setShowCounterModal(false);
      setCounterAmount('');
      setCounterNote('');
    } catch (error) {
      console.error('Error sending counter offer', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1E2430] border-t-[#563F7C] rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center bg-[#322D40] p-12 rounded-3xl border border-[#1E2430]">
            <h2 className="text-2xl font-bold text-white mb-4">Deal Room Not Found</h2>
            <Link href="/" className="text-[#563F7C] font-bold hover:underline">
              Return Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          
          {/* Deal Header */}
          <div className="bg-[#1E2430] border-b border-[#1E2430] text-white z-10 sticky top-0 lg:-mt-0 mt-16 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href={user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard'} className="mr-4 text-[#C8C5C7]/70 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="w-12 h-12 bg-[#322D40] rounded-lg flex items-center justify-center mr-4 border border-[#1E2430]">
                  <Home className="w-6 h-6 text-[#563F7C]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white mb-0.5 line-clamp-1">
                    {(deal.property || deal.propertyId)?.title || (deal.property || deal.propertyId)?.propertyType || 'Property'}
                  </h1>
                  <p className="text-xs text-[#C8C5C7] flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure Deal Room with {user.role === 'buyer' ? deal.sellerId?.name : deal.buyerId?.name}
                  </p>
                </div>
              </div>
              
              <div className={`px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[10px] border ${
                deal.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                deal.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                'bg-[#322D40]/50 text-[#C8C5C7] border-[#322D40]'
              }`}>
                {deal.status}
              </div>
            </div>
          </div>

          <main className="flex-1 p-4 sm:p-6 h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6 overflow-hidden">
            
            {/* Chat Panel - Left */}
            <div className="flex-1 bg-[#322D40] rounded-2xl border border-[#1E2430] flex flex-col overflow-hidden min-h-[400px]">
              <div className="p-4 border-b border-[#1E2430] bg-[#1E2430] flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center text-sm uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Live Messages
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#1E2430]">
                {deal.messages?.map((msg: any, index: number) => {
                  const isMine = msg.senderId === user._id;
                  return (
                    <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                        isMine 
                          ? 'bg-[#563F7C] text-white rounded-br-sm' 
                          : 'bg-[#322D40] border border-[#1E2430] text-white rounded-bl-sm'
                      }`}>
                        <p className="leading-relaxed text-sm">{msg.content}</p>
                        <span className={`text-[10px] font-medium block mt-1.5 text-right ${isMine ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]/70'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-[#1E2430] bg-[#1E2430]">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-[#322D40] border border-[#1E2430] rounded-xl focus:outline-none focus:border-[#563F7C] transition-colors text-white placeholder-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || deal.status === 'closed' || deal.status === 'accepted'}
                    className="bg-[#563F7C] text-white px-5 rounded-xl hover:bg-[#4A356A] disabled:opacity-50 transition-colors flex items-center justify-center font-bold"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
            
            {/* Offer History Panel - Right */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#1E2430] bg-[#322D40] min-h-[400px]">
              <div className="p-4 border-b border-[#1E2430] bg-[#1E2430]">
                <h2 className="text-sm uppercase tracking-wider font-bold text-white">Offer History</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#1E2430]">
                {deal.offers?.slice().reverse().map((offer: any, index: number) => {
                  const isMine = offer.senderId === user._id;
                  
                  let statusColors = 'bg-[#322D40]/50 text-[#C8C5C7] border-[#322D40]';
                  let borderColors = 'border-[#1E2430]';
                  
                  if (offer.status === 'pending') {
                    statusColors = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                    borderColors = 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
                  }
                  if (offer.status === 'accepted') {
                    statusColors = 'bg-green-500/10 text-green-500 border-green-500/20';
                  }
                  if (offer.status === 'rejected') {
                    statusColors = 'bg-red-500/10 text-red-500 border-red-500/20';
                  }
                  
                  return (
                    <div key={offer._id} className={`p-5 rounded-xl border transition-all bg-[#1E2430] ${borderColors}`}>
                      
                      <div className="flex justify-between items-center mb-3 border-b border-[#1E2430] pb-2">
                        <span className="text-[10px] font-bold text-[#C8C5C7]/70 uppercase tracking-wider">
                          {isMine ? 'Your Offer' : `${offer.senderRole}'s Offer`}
                        </span>
                        <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider border ${statusColors}`}>
                          {offer.status}
                        </span>
                      </div>

                      <div className="mb-3 text-center py-1">
                        <span className="text-2xl font-extrabold text-white">₹{offer.amount.toLocaleString()}</span>
                      </div>
                      
                      {offer.note && (
                        <div className="bg-[#322D40] p-3 rounded-lg text-xs text-[#C8C5C7] italic border border-[#1E2430] mb-3">
                          "{offer.note}"
                        </div>
                      )}
                      
                      <div className="text-[10px] text-[#C8C5C7]/50 text-center mb-1">
                        {new Date(offer.createdAt).toLocaleString()}
                      </div>
                      
                      {/* Action buttons for pending offer */}
                      {offer.status === 'pending' && !isMine && deal.status === 'active' && (
                        <div className="mt-4 pt-4 border-t border-[#1E2430]">
                          <div className="flex items-center text-xs text-[#C8C5C7] mb-3 justify-center">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                            Requires your response
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                              onClick={() => handleOfferAction(offer._id, 'accepted')}
                              disabled={actionLoading}
                              className="flex items-center justify-center py-2 bg-green-500/10 border border-green-500/20 text-green-500 font-bold rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                            >
                              <Check className="w-4 h-4 mr-1" /> Accept
                            </button>
                            <button
                              onClick={() => handleOfferAction(offer._id, 'rejected')}
                              disabled={actionLoading}
                              className="flex items-center justify-center py-2 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                            >
                              <X className="w-4 h-4 mr-1" /> Reject
                            </button>
                          </div>
                          <button
                            onClick={() => setShowCounterModal(true)}
                            disabled={actionLoading}
                            className="flex items-center justify-center w-full py-2 bg-[#322D40] border border-[#322D40] text-white font-bold rounded-lg hover:bg-[#322D40] transition-colors text-sm"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" /> Counter Offer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {deal.offers?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-[#C8C5C7]/70 text-sm">No offers have been made yet.</p>
                  </div>
                )}
              </div>
            </div>
            
          </main>
        </div>
        
        {/* Counter Offer Modal */}
        {showCounterModal && (
          <div className="fixed inset-0 bg-[#1E2430]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Make Counter Offer</h3>
                <button onClick={() => setShowCounterModal(false)} className="text-[#C8C5C7]/70 hover:text-white bg-[#1E2430] p-2 rounded-full border border-[#1E2430]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSendCounter}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#C8C5C7]/70 uppercase tracking-wider mb-2">Counter Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#C8C5C7]/70 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-[#1E2430] border border-[#1E2430] rounded-xl focus:border-[#563F7C] outline-none text-lg font-bold text-white transition-colors placeholder-gray-600"
                        placeholder="Enter new amount"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#C8C5C7]/70 uppercase tracking-wider mb-2">Message (Optional)</label>
                    <textarea
                      value={counterNote}
                      onChange={(e) => setCounterNote(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1E2430] border border-[#1E2430] rounded-xl focus:border-[#563F7C] outline-none resize-none transition-colors text-white placeholder-gray-600"
                      placeholder="Add a note explaining your counter offer"
                      rows={3}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={actionLoading || !counterAmount}
                      className="w-full bg-[#563F7C] text-white py-3.5 rounded-xl font-bold hover:bg-[#4A356A] transition-all shadow-lg shadow-[#563F7C]/20 disabled:opacity-50"
                    >
                      {actionLoading ? 'Sending...' : 'Send Counter Offer'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
