'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { ArrowLeft, Check, X, Shield, Activity, Info } from 'lucide-react';
import Link from 'next/link';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get('ids');
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!ids) {
        setLoading(false);
        return;
      }
      
      try {
        const idArray = ids.split(',');
        const promises = idArray.map(id => api.get(`/properties/${id}`));
        const responses = await Promise.all(promises);
        setProperties(responses.map(res => res.data));
      } catch (error) {
        console.error('Error fetching properties for comparison', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [ids]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#563F7C] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">No properties selected</h2>
        <button onClick={() => router.push('/buyer/dashboard')} className="bg-[#563F7C] text-white px-6 py-3 rounded-xl font-bold">
          Go back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => router.push('/buyer/dashboard')} className="mr-4 p-2 bg-[#322D40] rounded-full text-white hover:bg-[#563F7C] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">Compare Properties</h2>
            <p className="text-[#C8C5C7] mt-1">Side-by-side analysis of your selections</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px]">
          {/* Header Row: Images and Titles */}
          <div className="flex space-x-6 mb-8">
            <div className="w-48 shrink-0"></div> {/* Empty corner */}
            {properties.map(property => (
              <div key={property._id} className="flex-1 bg-[#322D40] rounded-2xl overflow-hidden border border-[#1E2430] shadow-lg flex flex-col relative">
                <button 
                  onClick={() => {
                    const newIds = properties.filter(p => p._id !== property._id).map(p => p._id).join(',');
                    if (newIds) {
                      router.push(`/buyer/compare?ids=${newIds}`);
                    } else {
                      router.push('/buyer/dashboard');
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white z-10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="h-48 relative">
                  {property.images && property.images[0] ? (
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1E2430] flex items-center justify-center text-[#C8C5C7]">No Image</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-white text-lg line-clamp-2 mb-2">{property.title}</h3>
                  <p className="text-[#C8C5C7] text-sm mb-4">{property.location}, {property.city}</p>
                  <Link href={`/properties/${property._id}`} className="mt-auto block text-center w-full py-2 bg-[#563F7C] hover:bg-[#4A356A] text-white font-bold rounded-lg transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-[#563F7C]/20 flex items-center justify-center mr-3 border border-[#563F7C]/30 text-[#B3A1C9]">₹</span>
              True Price Analysis
            </h3>
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] overflow-hidden">
              <div className="flex border-b border-[#1E2430] bg-[#1E2430]/50 p-4">
                <div className="w-48 shrink-0 font-bold text-[#C8C5C7]">Total Estimated Price</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 font-extrabold text-[#B3A1C9] text-xl">
                    ₹{(property.priceBreakdown?.totalEstimatedPrice || property.price).toLocaleString()}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Base Price</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white font-medium">
                    ₹{(property.priceBreakdown?.basePrice || property.price).toLocaleString()}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Reg & Stamp Duty</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.priceBreakdown ? `₹${(property.priceBreakdown.registrationFee + property.priceBreakdown.stampDuty).toLocaleString()}` : 'N/A'}
                  </div>
                ))}
              </div>
              <div className="flex p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Other Charges</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.priceBreakdown ? `₹${(property.priceBreakdown.gst + property.priceBreakdown.maintenanceFee + property.priceBreakdown.otherCharges).toLocaleString()}` : 'N/A'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transparency & Trust Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3 border border-blue-500/30 text-blue-400"><Shield className="w-4 h-4" /></span>
              Transparency & Trust
            </h3>
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] overflow-hidden">
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 font-bold text-[#C8C5C7]">Transparency Score</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3">
                    {property.transparencyScore ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        property.transparencyScore >= 90 ? 'bg-green-500/20 text-green-400' :
                        property.transparencyScore >= 75 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {property.transparencyScore}/100
                      </span>
                    ) : (
                      <span className="text-[#C8C5C7]/50 text-sm">Not Rated</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Dealer Score</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white font-medium">
                    {property.dealerTransparencyScore ? `${property.dealerTransparencyScore}/100` : 'N/A'}
                  </div>
                ))}
              </div>
              <div className="flex p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Verification</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3">
                    {property.verification?.isVerified ? (
                      <div className="flex items-center text-blue-400 text-sm font-bold">
                        <Check className="w-4 h-4 mr-1" /> Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-[#C8C5C7]/50 text-sm">
                        <X className="w-4 h-4 mr-1" /> Unverified
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area Reality Index Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3 border border-green-500/30 text-green-400"><Activity className="w-4 h-4" /></span>
              Area Reality Index (ARI)
            </h3>
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] overflow-hidden">
              <div className="flex border-b border-[#1E2430] bg-[#1E2430]/50 p-4">
                <div className="w-48 shrink-0 font-bold text-[#C8C5C7]">Overall ARI Score</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 font-bold text-white text-lg">
                    {property.areaRealityIndex?.averageRating ? `${property.areaRealityIndex.averageRating}/10` : 'N/A'}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Safety</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.areaRealityIndex?.safetyScore || '-'}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Connectivity</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.areaRealityIndex?.connectivityScore || '-'}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Amenities</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.areaRealityIndex?.amenitiesScore || '-'}
                  </div>
                ))}
              </div>
              <div className="flex p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Pollution</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.areaRealityIndex?.pollutionScore || '-'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mr-3 border border-orange-500/30 text-orange-400"><Info className="w-4 h-4" /></span>
              Property Specs
            </h3>
            <div className="bg-[#322D40] rounded-2xl border border-[#1E2430] overflow-hidden">
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Type</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white capitalize">
                    {property.propertyType}
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Area (sqft)</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.areaSqft} sqft
                  </div>
                ))}
              </div>
              <div className="flex border-b border-[#1E2430] p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Bedrooms</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.bedrooms} Beds
                  </div>
                ))}
              </div>
              <div className="flex p-4">
                <div className="w-48 shrink-0 text-[#C8C5C7]">Bathrooms</div>
                {properties.map(property => (
                  <div key={property._id} className="flex-1 px-3 text-white">
                    {property.bathrooms} Baths
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="Comparison Tool" 
            subtitle="Make an informed decision"
            showSearch={false}
          />
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#563F7C] border-t-transparent rounded-full"></div>
            </div>
          }>
            <CompareContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
