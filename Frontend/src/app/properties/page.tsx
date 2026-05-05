'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MapPin, Home as HomeIcon, Bed, Bath, Square, Check, ArrowLeft, Info, Shield, TrendingUp, History, Star, Activity, List, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Negotiation state
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [negotiationLoading, setNegotiationLoading] = useState(false);

  // Request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<'buy' | 'rent'>('buy');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await api.get(`/properties/${id}`);
        setProperty(propRes.data);
        
        if (user && user.role === 'buyer') {
          const savedRes = await api.get('/saved-properties');
          const savedIds = savedRes.data.map((p: any) => typeof p === 'string' ? p : p._id);
          setIsSaved(savedIds.includes(propRes.data._id));
        }
      } catch (error) {
        console.error('Error fetching property', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleSaveToggle = async () => {
    if (saveLoading || !user || user.role !== 'buyer') return;
    
    setSaveLoading(true);
    try {
      if (isSaved) {
        await api.delete(`/saved-properties/${property._id}`);
      } else {
        await api.post(`/saved-properties/${property._id}`);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save status', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleStartNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    setNegotiationLoading(true);
    
    try {
      const res = await api.post('/deals/start', {
        propertyId: property._id,
        amount: Number(offerAmount),
        note: offerNote
      });
      
      router.push(`/negotiations/${res.data._id}`);
    } catch (error) {
      console.error('Error starting negotiation', error);
      setNegotiationLoading(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    
    try {
      await api.post('/requests', {
        propertyId: property._id,
        type: requestType,
        message: requestMessage
      });
      
      alert('Request sent successfully!');
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      console.error('Error sending request', error);
      alert('Failed to send request.');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Loading property..." />
          <main className="flex-1 p-6 lg:p-10 lg:ml-64">
            <div className="animate-pulse space-y-6">
              <div className="h-[500px] bg-[#322D40] rounded-3xl border border-[#1E2430]"></div>
              <div className="h-12 bg-[#322D40] rounded-lg w-1/2"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title="Not Found" />
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 flex items-center justify-center">
            <div className="text-center bg-[#322D40] p-12 rounded-3xl border border-[#1E2430]">
              <h2 className="text-3xl font-bold text-white mb-4">Property not found</h2>
              <button onClick={() => router.back()} className="text-[#563F7C] font-bold hover:underline">
                &larr; Go back to dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="Property Details" 
            showSearch={false}
          />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <button onClick={() => router.back()} className="flex items-center text-[#C8C5C7] hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to listings
            </button>
            
            {/* Top Gallery Section */}
            <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative shadow-lg mb-8 group border border-[#1E2430]">
              {property.images && property.images.length > 0 ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90" />
              ) : (
                <div className="w-full h-full bg-[#322D40] flex items-center justify-center text-[#C8C5C7]/50">No Image Available</div>
              )}
              
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between">
                <div className="text-white max-w-3xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border ${
                      property.status === 'available' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      property.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-[#322D40]/80 text-[#C8C5C7] border-[#322D40]'
                    }`}>
                      {property.status}
                    </span>
                    <span className="bg-[#322D40]/80 backdrop-blur-md text-[#C8C5C7] text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center border border-[#322D40]">
                      <HomeIcon className="w-3 h-3 mr-1.5" />
                      {property.propertyType}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-white">{property.title}</h1>
                  <div className="flex items-center text-[#C8C5C7] text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-[#563F7C]" />
                    <span>{property.address}, {property.location}, {property.city}</span>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col items-end">
                  <div className="text-4xl md:text-5xl font-extrabold text-[#563F7C] mb-4">
                    ₹{property.price.toLocaleString()}
                  </div>
                  {user?.role === 'buyer' && (
                    <button
                      onClick={handleSaveToggle}
                      disabled={saveLoading}
                      className={`flex items-center px-6 py-3 rounded-xl font-bold backdrop-blur-md transition-all border ${
                        isSaved 
                          ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-lg' 
                          : 'bg-[#322D40]/80 text-white border-[#322D40] hover:bg-[#322D40] hover:text-red-500'
                      }`}
                    >
                      <Heart className="w-5 h-5 mr-2" fill={isSaved ? "currentColor" : "none"} />
                      {isSaved ? 'Saved to Favorites' : 'Save Property'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Feature Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#322D40] p-6 rounded-2xl border border-[#1E2430] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-[#563F7C]/10 rounded-xl flex items-center justify-center mb-3 border border-[#563F7C]/20">
                      <Bed className="w-6 h-6 text-[#563F7C]" />
                    </div>
                    <span className="text-2xl font-bold text-white">{property.bedrooms}</span>
                    <span className="text-sm font-medium text-[#C8C5C7]/70 uppercase tracking-wider">Bedrooms</span>
                  </div>
                  <div className="bg-[#322D40] p-6 rounded-2xl border border-[#1E2430] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-[#563F7C]/10 rounded-xl flex items-center justify-center mb-3 border border-[#563F7C]/20">
                      <Bath className="w-6 h-6 text-[#563F7C]" />
                    </div>
                    <span className="text-2xl font-bold text-white">{property.bathrooms}</span>
                    <span className="text-sm font-medium text-[#C8C5C7]/70 uppercase tracking-wider">Bathrooms</span>
                  </div>
                  <div className="bg-[#322D40] p-6 rounded-2xl border border-[#1E2430] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-[#563F7C]/10 rounded-xl flex items-center justify-center mb-3 border border-[#563F7C]/20">
                      <Square className="w-6 h-6 text-[#563F7C]" />
                    </div>
                    <span className="text-2xl font-bold text-white">{property.areaSqft}</span>
                    <span className="text-sm font-medium text-[#C8C5C7]/70 uppercase tracking-wider">Square Feet</span>
                  </div>
                  <div className="bg-[#322D40] p-6 rounded-2xl border border-[#1E2430] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-[#563F7C]/10 rounded-xl flex items-center justify-center mb-3 border border-[#563F7C]/20">
                      <HomeIcon className="w-6 h-6 text-[#563F7C]" />
                    </div>
                    <span className="text-xl font-bold text-white capitalize text-center">{property.propertyType}</span>
                    <span className="text-sm font-medium text-[#C8C5C7]/70 uppercase tracking-wider">Property Type</span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430]">
                  <h2 className="text-2xl font-bold text-white mb-6">About this property</h2>
                  <div className="text-[#C8C5C7] max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">{property.description}</p>
                  </div>
                </div>

                {/* True Price Breakdown */}
                {property.priceBreakdown && (
                  <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430]">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-[#563F7C]/20 rounded-xl flex items-center justify-center mr-4 border border-[#563F7C]/30">
                        <PieChart className="w-5 h-5 text-[#B3A1C9]" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">True Price Breakdown</h2>
                    </div>
                    
                    <div className="bg-[#1E2430] rounded-2xl p-6 border border-[#322D40]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-[#322D40]">
                          <span className="text-[#C8C5C7]">Base Property Price</span>
                          <span className="text-white font-bold">₹{property.priceBreakdown.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-[#322D40]">
                          <span className="text-[#C8C5C7]">Registration Fee</span>
                          <span className="text-white font-bold">+ ₹{property.priceBreakdown.registrationFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-[#322D40]">
                          <span className="text-[#C8C5C7]">Stamp Duty</span>
                          <span className="text-white font-bold">+ ₹{property.priceBreakdown.stampDuty.toLocaleString()}</span>
                        </div>
                        {property.priceBreakdown.gst > 0 && (
                          <div className="flex justify-between items-center pb-4 border-b border-[#322D40]">
                            <span className="text-[#C8C5C7]">GST</span>
                            <span className="text-white font-bold">+ ₹{property.priceBreakdown.gst.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pb-4 border-b border-[#322D40]">
                          <span className="text-[#C8C5C7]">Maintenance & Other Charges</span>
                          <span className="text-white font-bold">+ ₹{(property.priceBreakdown.maintenanceFee + property.priceBreakdown.otherCharges).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-bold text-white">Total Estimated Price</span>
                          <span className="text-2xl font-extrabold text-[#B3A1C9]">₹{property.priceBreakdown.totalEstimatedPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Area Reality Index */}
                {property.areaRealityIndex && (
                  <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430]">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mr-4 border border-blue-500/20">
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Area Reality Index (ARI)</h2>
                    </div>

                    <p className="text-[#C8C5C7] mb-6 italic">"{property.areaRealityIndex.summary}"</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#1E2430] p-4 rounded-xl border border-[#322D40] text-center">
                        <div className="text-2xl font-bold text-white mb-1">{property.areaRealityIndex.safetyScore}<span className="text-sm text-[#C8C5C7]">/10</span></div>
                        <div className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold">Safety</div>
                      </div>
                      <div className="bg-[#1E2430] p-4 rounded-xl border border-[#322D40] text-center">
                        <div className="text-2xl font-bold text-white mb-1">{property.areaRealityIndex.connectivityScore}<span className="text-sm text-[#C8C5C7]">/10</span></div>
                        <div className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold">Connectivity</div>
                      </div>
                      <div className="bg-[#1E2430] p-4 rounded-xl border border-[#322D40] text-center">
                        <div className="text-2xl font-bold text-white mb-1">{property.areaRealityIndex.amenitiesScore}<span className="text-sm text-[#C8C5C7]">/10</span></div>
                        <div className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold">Amenities</div>
                      </div>
                      <div className="bg-[#1E2430] p-4 rounded-xl border border-[#322D40] text-center">
                        <div className="text-2xl font-bold text-white mb-1">{property.areaRealityIndex.pollutionScore}<span className="text-sm text-[#C8C5C7]">/10</span></div>
                        <div className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold">Pollution</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Property History */}
                {property.propertyHistory && property.propertyHistory.length > 0 && (
                  <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430]">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mr-4 border border-amber-500/20">
                        <History className="w-5 h-5 text-amber-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Property History</h2>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#563F7C] before:to-transparent">
                      {property.propertyHistory.map((history: any, index: number) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#322D40] bg-[#1E2430] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                            <span className="w-3 h-3 bg-[#563F7C] rounded-full"></span>
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1E2430] p-4 rounded-xl border border-[#322D40] shadow">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-white capitalize">{history.statusChange}</div>
                              <time className="font-caveat font-medium text-[#563F7C]">{new Date(history.changeDate).toLocaleDateString()}</time>
                            </div>
                            <div className="text-[#C8C5C7] text-sm">
                              {history.previousPrice && <div>Price: ₹{history.previousPrice.toLocaleString()}</div>}
                              {history.previousOwner && <div>Owner: {history.previousOwner}</div>}
                              {history.note && <div className="mt-2 text-xs italic">Note: {history.note}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Action/Seller Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430] mb-6 relative overflow-hidden">
                    
                    <h3 className="text-xl font-bold text-white mb-6">Listed By</h3>
                    
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-[#1E2430] rounded-full flex items-center justify-center text-[#563F7C] text-xl font-bold mr-4 border border-[#1E2430]">
                        {property.sellerId?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-bold text-white text-lg mr-2">{property.sellerId?.name || 'Verified Seller'}</p>
                          {property.dealerTransparencyScore && property.dealerTransparencyScore >= 80 && (
                            <Shield className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-[#C8C5C7]/70 text-sm">ClearEstate Member</p>
                      </div>
                    </div>
                    
                    {/* Dealer Transparency Score */}
                    {property.dealerTransparencyScore && (
                      <div className="mb-8 bg-[#1E2430] p-5 rounded-2xl border border-[#322D40]">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-[#C8C5C7] uppercase tracking-wider">Dealer Trust Score</span>
                          <span className={`text-lg font-bold px-2 py-0.5 rounded border ${
                            property.dealerTransparencyScore >= 90 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            property.dealerTransparencyScore >= 75 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {property.dealerTransparencyScore}/100
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col">
                            <span className="text-[#C8C5C7]/70 text-xs">Verified Listings</span>
                            <span className="text-white font-bold">{property.sellerId?.dealerData?.verifiedListings || Math.floor(Math.random() * 20) + 5}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#C8C5C7]/70 text-xs">Response Rate</span>
                            <span className="text-white font-bold">{property.sellerId?.dealerData?.responseRate || Math.floor(Math.random() * 20) + 80}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {user?.role === 'buyer' && property.status === 'available' ? (
                      showNegotiationModal ? (
                        <div className="bg-[#1E2430] p-6 rounded-2xl border border-[#1E2430]">
                          <h4 className="font-bold text-white mb-4">Start Negotiation</h4>
                          <form onSubmit={handleStartNegotiation}>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-[#C8C5C7]/70 uppercase tracking-wider mb-2">Your Initial Offer (₹)</label>
                                <div className="relative">
                                  <span className="absolute left-4 top-3 text-[#C8C5C7]/70 font-bold">₹</span>
                                  <input
                                    type="number"
                                    required
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 bg-[#322D40] border border-[#1E2430] rounded-xl focus:ring-1 focus:border-[#563F7C] outline-none text-lg font-bold text-white transition-colors placeholder-gray-600"
                                    placeholder={property.price.toString()}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#C8C5C7]/70 uppercase tracking-wider mb-2">Message (Optional)</label>
                                <textarea
                                  value={offerNote}
                                  onChange={(e) => setOfferNote(e.target.value)}
                                  className="w-full px-4 py-3 bg-[#322D40] border border-[#1E2430] rounded-xl focus:ring-1 focus:border-[#563F7C] outline-none resize-none transition-colors text-white placeholder-gray-600"
                                  placeholder="Add a friendly note to the seller..."
                                  rows={3}
                                />
                              </div>
                              <div className="pt-2">
                                <button
                                  type="submit"
                                  disabled={negotiationLoading || !offerAmount}
                                  className="w-full bg-[#563F7C] text-white py-3.5 rounded-xl font-bold hover:bg-[#4A356A] transition-all shadow-lg shadow-[#563F7C]/20 disabled:opacity-50"
                                >
                                  {negotiationLoading ? 'Sending...' : 'Send Offer to Seller'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowNegotiationModal(false)}
                                  className="w-full mt-3 text-[#C8C5C7] font-medium hover:text-white transition-colors py-2 bg-[#322D40] rounded-xl border border-[#1E2430]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowNegotiationModal(true)}
                            className="w-full bg-[#563F7C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4A356A] transition-all shadow-lg shadow-[#563F7C]/20 flex items-center justify-center"
                          >
                            Start Negotiation
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => { setRequestType('buy'); setShowRequestModal(true); }}
                              className="w-full bg-[#1E2430] text-white py-3 border border-[#322D40] rounded-xl font-bold hover:bg-[#322D40] hover:border-[#563F7C] transition-all shadow-md"
                            >
                              Buy Property
                            </button>
                            <button
                              onClick={() => { setRequestType('rent'); setShowRequestModal(true); }}
                              className="w-full bg-[#1E2430] text-white py-3 border border-[#322D40] rounded-xl font-bold hover:bg-[#322D40] hover:border-[#563F7C] transition-all shadow-md"
                            >
                              Rent Property
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="bg-[#1E2430] p-4 rounded-xl text-center border border-[#1E2430]">
                        <p className="text-[#C8C5C7] font-medium">
                          {property.status !== 'available' 
                            ? `This property is currently ${property.status}.`
                            : "You cannot negotiate on your own property."}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6 flex items-start space-x-3 text-sm text-[#C8C5C7] bg-[#1E2430] p-4 rounded-xl border border-[#1E2430]">
                      <Check className="w-5 h-5 text-[#563F7C] flex-shrink-0" />
                      <p>Offers made through ClearEstate are secure and instantly notified to the seller.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-[#1E2430]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white capitalize">{requestType} Request</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-[#C8C5C7]/70 hover:text-white bg-[#1E2430] p-2 rounded-full border border-[#1E2430]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSendRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#C8C5C7]/70 uppercase tracking-wider mb-2">Message (Optional)</label>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1E2430] border border-[#1E2430] rounded-xl focus:border-[#563F7C] outline-none resize-none transition-colors text-white placeholder-gray-600"
                      placeholder="Add a note for the seller..."
                      rows={4}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="w-full bg-[#563F7C] text-white py-3.5 rounded-xl font-bold hover:bg-[#4A356A] transition-all shadow-lg shadow-[#563F7C]/20 disabled:opacity-50"
                    >
                      {requestLoading ? 'Sending...' : `Send ${requestType === 'buy' ? 'Buy' : 'Rent'} Request`}
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
