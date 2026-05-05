'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyCard from '@/components/PropertyCard';
import AdvancedFilters, { FilterState } from '@/components/AdvancedFilters';
import api from '@/lib/api';
import { Search, Filter, X } from 'lucide-react';

export default function BuyerDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparedProperties, setComparedProperties] = useState<any[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<any>({ cities: [], locations: [], propertyTypes: [] });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '', maxPrice: '',
    minArea: '', maxArea: '',
    bedrooms: '', propertyType: '',
    city: '', location: '',
    minTransparencyScore: '', minAriScore: '',
    verified: false
  });

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get('/properties/filter-options');
      setFilterOptions(res.data);
    } catch (error) {
      console.error('Error fetching filter options', error);
    }
  };

  const fetchData = useCallback(async (currentFilters: FilterState, search: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          params.append(key, String(value));
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const [propsRes, savedRes] = await Promise.all([
        api.get(`/properties${queryString}`),
        api.get('/saved-properties')
      ]);
      
      setProperties(propsRes.data);
      const savedIds = savedRes.data.map((p: any) => typeof p === 'string' ? p : p._id);
      setSavedPropertyIds(savedIds);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(filters, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, fetchData]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleSeedData = async () => {
    try {
      setLoading(true);
      await api.post('/properties/seed');
      fetchData(filters, searchQuery);
    } catch (error) {
      console.error('Error seeding data', error);
      alert('Failed to seed data');
    }
  };

  const handleCompareToggle = (property: any, isCompared: boolean) => {
    if (isCompared) {
      if (comparedProperties.length >= 3) {
        alert("You can only compare up to 3 properties at once.");
        return;
      }
      setComparedProperties([...comparedProperties, property]);
    } else {
      setComparedProperties(comparedProperties.filter(p => p._id !== property._id));
    }
  };

  const goToCompare = () => {
    if (comparedProperties.length < 2) {
      alert("Please select at least 2 properties to compare.");
      return;
    }
    const ids = comparedProperties.map(p => p._id).join(',');
    window.location.href = `/buyer/compare?ids=${ids}`;
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== false).length;

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="Dashboard Overview" 
            subtitle="Discover your dream property with complete transparency"
            showSearch={true}
            locations={filterOptions.locations}
            selectedLocation={filters.location}
            onLocationChange={(loc) => setFilters(prev => ({ ...prev, location: loc }))}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setIsFiltersOpen(true)}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            
            {/* Main Overview Summary */}
            <div className="bg-[#322D40] rounded-3xl p-8 border border-[#1E2430] mb-8 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#563F7C]/20 rounded-full blur-2xl"></div>
              <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Welcome to ClearEstate</h2>
              <p className="text-[#C8C5C7] max-w-2xl relative z-10">
                Browse exclusive listings, save your favorites, and negotiate directly with sellers in secure deal rooms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? `Results for "${searchQuery}"` : 'Recommended For You'}
              </h2>
              
              {/* Active Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {activeFilterCount > 0 && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        minPrice: '', maxPrice: '', minArea: '', maxArea: '',
                        bedrooms: '', propertyType: '', city: '', location: '',
                        minTransparencyScore: '', minAriScore: '', verified: false
                      });
                    }}
                    className="flex items-center bg-[#1E2430] text-[#C8C5C7] px-3 py-1.5 rounded-full border border-[#322D40] text-xs font-bold hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
                {filters.location && (
                  <div className="flex items-center bg-[#563F7C]/20 text-[#B3A1C9] px-3 py-1.5 rounded-full border border-[#563F7C]/30 text-xs font-bold">
                    Location: {filters.location}
                    <button onClick={() => setFilters(prev => ({ ...prev, location: '' }))} className="ml-2 hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {filters.propertyType && (
                  <div className="flex items-center bg-[#563F7C]/20 text-[#B3A1C9] px-3 py-1.5 rounded-full border border-[#563F7C]/30 text-xs font-bold">
                    Type: {filters.propertyType}
                    <button onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))} className="ml-2 hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {filters.verified && (
                  <div className="flex items-center bg-[#563F7C]/20 text-[#B3A1C9] px-3 py-1.5 rounded-full border border-[#563F7C]/30 text-xs font-bold">
                    Verified Only
                    <button onClick={() => setFilters(prev => ({ ...prev, verified: false }))} className="ml-2 hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {/* Additional chips could be added here for other filters */}
              </div>
            </div>

            <AdvancedFilters
              isOpen={isFiltersOpen}
              onClose={() => setIsFiltersOpen(false)}
              onApply={setFilters}
              initialFilters={filters}
              filterOptions={filterOptions}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
                    isSaved={savedPropertyIds.includes(property._id)}
                    showSaveButton={true}
                    showCompareButton={true}
                    isCompared={comparedProperties.some(p => p._id === property._id)}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#322D40] rounded-3xl border border-[#1E2430] max-w-3xl mx-auto mt-12 shadow-lg flex flex-col items-center">
                <div className="w-20 h-20 bg-[#1E2430] rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-[#563F7C]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No properties found</h3>
                <p className="text-[#C8C5C7] mb-8">There are currently no listings available. You can load demo data with full transparency features.</p>
                <button 
                  onClick={handleSeedData}
                  disabled={loading}
                  className="bg-[#563F7C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4A356A] transition-colors shadow-md shadow-[#563F7C]/20"
                >
                  {loading ? 'Loading...' : 'Load Demo Data'}
                </button>
              </div>
            )}
          </main>
          
          {/* Floating Compare Bar */}
          {comparedProperties.length > 0 && (
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#322D40] border-t border-[#563F7C] p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between transform transition-transform animate-in slide-in-from-bottom">
              <div className="flex items-center">
                <div className="flex -space-x-4 mr-6">
                  {comparedProperties.map((p, i) => (
                    <div key={p._id} className="w-12 h-12 rounded-xl border-2 border-[#1E2430] overflow-hidden bg-[#1E2430] shadow-md z-10" style={{ zIndex: 10 - i }}>
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white">Img</div>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-12 h-12 rounded-xl border-2 border-dashed border-[#563F7C]/50 flex items-center justify-center bg-[#1E2430]/50 z-0" style={{ zIndex: 0 }}>
                      <span className="text-[#C8C5C7]/50 text-xs">+</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-white font-bold">{comparedProperties.length} selected for comparison</h4>
                  <p className="text-[#C8C5C7] text-sm">Select up to 3 properties</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setComparedProperties([])}
                  className="px-4 py-2 rounded-lg text-[#C8C5C7] hover:text-white hover:bg-[#1E2430] transition-colors font-medium text-sm"
                >
                  Clear All
                </button>
                <button 
                  onClick={goToCompare}
                  disabled={comparedProperties.length < 2}
                  className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-colors ${
                    comparedProperties.length >= 2 
                      ? 'bg-[#563F7C] text-white hover:bg-[#4A356A] shadow-[#563F7C]/20' 
                      : 'bg-[#1E2430] text-[#C8C5C7]/50 cursor-not-allowed border border-[#322D40]'
                  }`}
                >
                  Compare Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
