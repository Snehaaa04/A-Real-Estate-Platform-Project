import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';

interface PropertyCardProps {
  property: any;
  isSaved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
  showSaveButton?: boolean;
  isCompared?: boolean;
  onCompareToggle?: (property: any, isCompared: boolean) => void;
  showCompareButton?: boolean;
}

export default function PropertyCard({ 
  property, 
  isSaved = false, 
  onSaveToggle, 
  showSaveButton = false,
  isCompared = false,
  onCompareToggle,
  showCompareButton = false
}: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);
  const [compared, setCompared] = useState(isCompared);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      if (saved) {
        await api.delete(`/saved-properties/${property._id}`);
      } else {
        await api.post(`/saved-properties/${property._id}`);
      }
      setSaved(!saved);
      if (onSaveToggle) {
        onSaveToggle(property._id, !saved);
      }
    } catch (error) {
      console.error('Error toggling save status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCompared = !compared;
    setCompared(newCompared);
    if (onCompareToggle) {
      onCompareToggle(property, newCompared);
    }
  };

  // Determine which price to show (total estimated or base)
  const displayPrice = property.priceBreakdown?.totalEstimatedPrice || property.price;

  return (
    <Link href={`/properties/${property._id}`} className="group block h-full">
      <div className={`bg-[#322D40] rounded-2xl border ${compared ? 'border-[#563F7C] shadow-[#563F7C]/20 shadow-lg' : 'border-[#322D40] hover:border-[#563F7C] shadow-lg'} overflow-hidden transition-all duration-300 relative flex flex-col h-full transform hover:-translate-y-1`}>
        
        {/* Top Image Section */}
        <div className="h-56 bg-[#1E2430] relative overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C8C5C7] bg-[#1E2430]">No Image</div>
          )}
          
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/70 to-transparent">
            <div className={`text-xs font-bold px-3 py-1.5 rounded-md capitalize border shadow-sm ${
              property.status === 'available' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              property.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              property.status === 'sold' ? 'bg-[#563F7C]/40 text-[#B3A1C9] border-[#563F7C]/50' :
              'bg-[#1E2430]/80 text-[#C8C5C7] border-[#322D40]'
            }`}>
              {property.status}
            </div>
            
            {showSaveButton && (
              <button
                onClick={handleSaveToggle}
                disabled={loading}
                className={`p-2 rounded-full shadow-sm transition-all duration-200 backdrop-blur-md border ${
                  saved 
                    ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                    : 'bg-[#1E2430]/80 text-[#C8C5C7] border-[#322D40] hover:bg-[#563F7C] hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" fill={saved ? "currentColor" : "none"} strokeWidth={saved ? 1.5 : 2} />
              </button>
            )}
          </div>
          
          {/* Transparency Badges (Top right below save) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
            <div className="flex flex-col gap-1.5">
              {property.transparencyScore && (
                <div className="bg-[#563F7C]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center w-max border border-[#B3A1C9]/30">
                  <span className="mr-1">🛡️</span> {property.transparencyScore}/100 Transparency
                </div>
              )}
              {property.areaRealityIndex && (
                <div className="bg-[#1E2430]/90 backdrop-blur-md text-[#B3A1C9] text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center w-max border border-[#322D40]">
                  <span className="mr-1">📍</span> ARI: {property.areaRealityIndex.averageRating}/10
                </div>
              )}
            </div>
            {property.verification?.isVerified && (
              <div className="bg-blue-500/90 backdrop-blur-md text-white p-1.5 rounded-full shadow-sm border border-blue-400/50" title="Verified Listing">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Details Section */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[#B3A1C9] font-extrabold text-2xl tracking-tight">
              ₹{displayPrice.toLocaleString()}
              {property.priceBreakdown && <span className="text-[10px] text-[#C8C5C7]/70 block font-normal uppercase tracking-wider">True Estimated Price</span>}
            </div>
            {showCompareButton && (
              <button 
                onClick={handleCompareToggle}
                className={`flex items-center text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                  compared ? 'bg-[#563F7C]/20 border-[#563F7C] text-[#B3A1C9]' : 'bg-[#1E2430] border-[#322D40] text-[#C8C5C7] hover:border-[#C8C5C7]/50'
                }`}
              >
                {compared ? 'Selected' : '+ Compare'}
              </button>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#B3A1C9] transition-colors">{property.title}</h3>
          
          <div className="flex items-center text-[#C8C5C7] text-sm mb-5">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-[#B3A1C9]" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
          
          <div className="mt-auto pt-4 border-t border-[#1E2430]">
            <div className="flex items-center justify-between text-sm text-[#C8C5C7]">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1.5 text-[#563F7C]" />
                <span className="font-semibold text-[#B3A1C9] mr-1">{property.bedrooms}</span> Beds
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1.5 text-[#563F7C]" />
                <span className="font-semibold text-[#B3A1C9] mr-1">{property.bathrooms}</span> Baths
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1.5 text-[#563F7C]" />
                <span className="font-semibold text-[#B3A1C9] mr-1">{property.areaSqft}</span> sqft
              </div>
            </div>
            
            {property.soldTo && (
              <div className="mt-4 pt-4 border-t border-[#1E2430] bg-[#1E2430]/50 -mx-5 -mb-5 p-5">
                <h4 className="text-xs font-bold text-[#C8C5C7] uppercase tracking-wider mb-2">Sold Details</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{property.soldTo.name}</div>
                    <div className="text-xs text-[#C8C5C7]">{property.soldTo.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#C8C5C7] uppercase">Final Price</div>
                    <div className="text-sm font-bold text-[#563F7C]">₹{property.finalSoldPrice?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
