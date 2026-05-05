import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  bedrooms: string;
  propertyType: string;
  city: string;
  location: string;
  minTransparencyScore: string;
  minAriScore: string;
  verified: boolean;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  filterOptions?: any;
}

export default function AdvancedFilters({ isOpen, onClose, onApply, initialFilters, filterOptions = {} }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync internal state with external props if they change
  React.useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    const resetState = {
      minPrice: '', maxPrice: '',
      minArea: '', maxArea: '',
      bedrooms: '', propertyType: '',
      city: '', location: '',
      minTransparencyScore: '', minAriScore: '',
      verified: false
    };
    setFilters(resetState);
    onApply(resetState);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1E2430] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#322D40] flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#322D40] flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Filter className="w-5 h-5 mr-2 text-[#563F7C]" />
            Advanced Filters
          </h2>
          <button onClick={onClose} className="text-[#C8C5C7] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Price & Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">Price Range (₹)</label>
              <div className="flex items-center space-x-3">
                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder={`Min (${filterOptions.minPrice || 0})`} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2 text-white focus:border-[#563F7C] outline-none" />
                <span className="text-[#C8C5C7]">-</span>
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder={`Max (${filterOptions.maxPrice || 'Any'})`} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2 text-white focus:border-[#563F7C] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">Area (Sq.ft)</label>
              <div className="flex items-center space-x-3">
                <input type="number" name="minArea" value={filters.minArea} onChange={handleChange} placeholder={`Min (${filterOptions.minArea || 0})`} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2 text-white focus:border-[#563F7C] outline-none" />
                <span className="text-[#C8C5C7]">-</span>
                <input type="number" name="maxArea" value={filters.maxArea} onChange={handleChange} placeholder={`Max (${filterOptions.maxArea || 'Any'})`} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2 text-white focus:border-[#563F7C] outline-none" />
              </div>
            </div>
          </div>

          {/* Type & BHK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">Property Type</label>
              <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2.5 text-white focus:border-[#563F7C] outline-none appearance-none capitalize">
                <option value="">Any Type</option>
                {filterOptions.propertyTypes?.map((type: string) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                {(!filterOptions.propertyTypes || filterOptions.propertyTypes.length === 0) && (
                  <>
                    <option value="apartment">Apartment</option>
                    <option value="house">House / Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">BHK / Family Size</label>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="w-full bg-[#322D40] border border-[#1E2430] rounded-xl px-4 py-2.5 text-white focus:border-[#563F7C] outline-none appearance-none">
                <option value="">Any Size</option>
                <option value="1">1 BHK</option>
                <option value="2-3">2-3 BHK</option>
                <option value="4+">4+ BHK</option>
              </select>
            </div>
          </div>

          {/* Removed Location (now in TopBar) */}
          {/* Transparency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">Min Transparency Score</label>
              <input type="range" name="minTransparencyScore" min="0" max="100" value={filters.minTransparencyScore || "0"} onChange={handleChange} className="w-full accent-[#563F7C]" />
              <div className="text-right text-xs text-[#563F7C] font-bold mt-1">{filters.minTransparencyScore || 0}+</div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#C8C5C7] mb-2">Min ARI Score</label>
              <input type="range" name="minAriScore" min="0" max="10" step="0.5" value={filters.minAriScore || "0"} onChange={handleChange} className="w-full accent-[#563F7C]" />
              <div className="text-right text-xs text-[#563F7C] font-bold mt-1">{filters.minAriScore || 0}+</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input type="checkbox" id="verified" name="verified" checked={filters.verified} onChange={handleChange} className="w-5 h-5 rounded border-[#1E2430] bg-[#322D40] text-[#563F7C] focus:ring-[#563F7C]" />
            <label htmlFor="verified" className="text-sm font-bold text-white">Show Verified Properties Only</label>
          </div>
        </div>

        <div className="p-6 border-t border-[#322D40] flex justify-end space-x-4">
          <button onClick={handleReset} className="px-6 py-2.5 rounded-xl font-bold text-[#C8C5C7] hover:text-white hover:bg-[#322D40] transition-colors">
            Reset All
          </button>
          <button onClick={handleApply} className="px-6 py-2.5 rounded-xl font-bold bg-[#563F7C] text-white hover:bg-[#4A356A] shadow-lg shadow-[#563F7C]/20 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
