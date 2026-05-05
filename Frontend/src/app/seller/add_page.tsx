'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Home, MapPin, Grid, Image as ImageIcon, CheckCircle, ChevronRight, ChevronLeft, Save } from 'lucide-react';

const DRAFT_KEY = 'draft_property_listing';

export default function AddProperty() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    city: '',
    location: '',
    address: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    areaSqft: '',
    description: '',
    status: 'available',
    // Transparency fields
    registrationFee: '0',
    stampDuty: '0',
    gst: '0',
    maintenanceFee: '0',
    brokerageFee: '0',
    otherCharges: '0',
    ariSafetyScore: '8.5',
    ariConnectivityScore: '8.5',
    ariAmenitiesScore: '8.5',
    ariPollutionScore: '7.0',
    ariSummary: 'A great neighborhood with good connectivity.'
  });

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          setFormData(parsed.formData);
        }
        if (parsed.step) {
          setStep(parsed.step);
        }
        if (parsed.timestamp) {
          setDraftSavedTime(new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Don't save empty form initially
      if (formData.title || formData.price || formData.city) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          formData,
          step,
          timestamp: new Date().toISOString()
        }));
        setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData({
      title: '', price: '', city: '', location: '', address: '',
      propertyType: 'apartment', bedrooms: '', bathrooms: '', areaSqft: '',
      description: '', status: 'available', images: '',
      registrationFee: '0', stampDuty: '0', gst: '0', maintenanceFee: '0', brokerageFee: '0', otherCharges: '0',
      ariSafetyScore: '8.5', ariConnectivityScore: '8.5', ariAmenitiesScore: '8.5', ariPollutionScore: '7.0', ariSummary: ''
    });
    setStep(1);
    setDraftSavedTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imagesArray: string[] = [];
      
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
        
        try {
          const uploadRes = await api.post('/upload/property-images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          imagesArray = uploadRes.data;
        } catch (uploadErr) {
          console.error('Failed to upload images', uploadErr);
          alert('Failed to upload images. Proceeding with placeholders if available.');
        }
      }
      
      if (imagesArray.length === 0) {
        imagesArray = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop'];
      }

      const basePrice = Number(formData.price) || 0;
      const regFee = Number(formData.registrationFee) || 0;
      const stampDuty = Number(formData.stampDuty) || 0;
      const gst = Number(formData.gst) || 0;
      const maintenance = Number(formData.maintenanceFee) || 0;
      const brokerage = Number(formData.brokerageFee) || 0;
      const other = Number(formData.otherCharges) || 0;
      const totalEstimatedPrice = basePrice + regFee + stampDuty + gst + maintenance + brokerage + other;

      const payload = {
        ...formData,
        price: basePrice,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqft: Number(formData.areaSqft),
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop'],
        priceBreakdown: {
          basePrice,
          registrationFee: regFee,
          stampDuty,
          gst,
          maintenanceFee: maintenance,
          brokerageFee: brokerage,
          otherCharges: other,
          totalEstimatedPrice
        },
        areaRealityIndex: {
          city: formData.city,
          areaName: formData.location,
          safetyScore: Number(formData.ariSafetyScore),
          connectivityScore: Number(formData.ariConnectivityScore),
          amenitiesScore: Number(formData.ariAmenitiesScore),
          pollutionScore: Number(formData.ariPollutionScore),
          averageRating: (Number(formData.ariSafetyScore) + Number(formData.ariConnectivityScore) + Number(formData.ariAmenitiesScore) + Number(formData.ariPollutionScore)) / 4,
          summary: formData.ariSummary
        },
        transparencyScore: 95,
        dealerTransparencyScore: 90,
        verification: {
          isVerified: false,
          documentsVerified: true,
          ownershipVerified: true,
          priceVerified: true
        }
      };

      await api.post('/properties', payload);
      
      // Clear draft on success
      localStorage.removeItem(DRAFT_KEY);
      
      router.push('/seller/dashboard');
    } catch (error) {
      console.error('Error submitting property', error);
      alert('Failed to publish property. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const inputClass = "w-full px-4 py-3 bg-[#1E2430] border border-[#322D40] rounded-xl focus:border-[#563F7C] focus:ring-1 focus:ring-[#563F7C] outline-none transition-colors text-white placeholder-[#C8C5C7]/50";
  const labelClass = "block text-sm font-bold text-[#C8C5C7] mb-2";

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="List Your Property" 
            subtitle="PREMIUM SELLER PORTAL"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              
              {/* Draft Status Header */}
              <div className="flex justify-between items-center mb-8 bg-[#322D40] p-4 rounded-xl border border-[#1E2430]">
                <div className="flex items-center text-sm">
                  <Save className="w-4 h-4 mr-2 text-[#563F7C]" />
                  {draftSavedTime ? (
                    <span className="text-[#C8C5C7]">Draft saved automatically at <span className="font-bold text-white">{draftSavedTime}</span></span>
                  ) : (
                    <span className="text-[#C8C5C7]/50">Draft will save automatically</span>
                  )}
                </div>
                {draftSavedTime && (
                  <button onClick={handleClearDraft} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg">
                    Clear Draft
                  </button>
                )}
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-10 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-[#322D40] -z-10 transform -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 h-0.5 bg-[#563F7C] -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                
                {[
                  { num: 1, label: 'Basic Details', icon: Home },
                  { num: 2, label: 'Location', icon: MapPin },
                  { num: 3, label: 'Specs', icon: Grid },
                  { num: 4, label: 'Media & Info', icon: ImageIcon }
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 bg-[#1E2430] ${
                      step >= s.num ? 'border-[#563F7C] text-[#563F7C] shadow-[0_0_15px_rgba(86,63,124,0.3)]' : 'border-[#322D40] text-[#C8C5C7]/50'
                    }`}>
                      {step > s.num ? <CheckCircle className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-white' : 'text-[#C8C5C7]/50'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Container */}
              <div className="bg-[#322D40] p-8 rounded-3xl border border-[#1E2430] shadow-xl">
                <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                  
                  {/* Step 1: Basic Details */}
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1E2430] pb-4">Basic Details & True Price Breakdown</h2>
                      <div>
                        <label className={labelClass}>Property Title</label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="e.g. Modern Luxury Villa with Ocean View"
                        />
                      </div>
                      
                      <div className="bg-[#1E2430] p-6 rounded-2xl border border-[#322D40] space-y-4">
                        <h3 className="text-white font-bold mb-4">Pricing Breakdown (Transparency Feature)</h3>
                        <div>
                          <label className={labelClass}>Base Expected Price (₹)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-[#C8C5C7]/50 font-bold">₹</span>
                            <input
                              type="number"
                              name="price"
                              required
                              min="0"
                              value={formData.price}
                              onChange={handleChange}
                              className={`${inputClass} pl-8`}
                              placeholder="e.g. 5000000"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Registration Fee</label>
                            <input type="number" name="registrationFee" value={formData.registrationFee} onChange={handleChange} className={inputClass} placeholder="0" />
                          </div>
                          <div>
                            <label className={labelClass}>Stamp Duty</label>
                            <input type="number" name="stampDuty" value={formData.stampDuty} onChange={handleChange} className={inputClass} placeholder="0" />
                          </div>
                          <div>
                            <label className={labelClass}>GST</label>
                            <input type="number" name="gst" value={formData.gst} onChange={handleChange} className={inputClass} placeholder="0" />
                          </div>
                          <div>
                            <label className={labelClass}>Maintenance / Brokerage / Other</label>
                            <input type="number" name="maintenanceFee" value={formData.maintenanceFee} onChange={handleChange} className={inputClass} placeholder="Total Other Charges" />
                          </div>
                        </div>
                        <div className="pt-4 border-t border-[#322D40] flex justify-between items-center">
                          <span className="text-[#C8C5C7] font-bold">Total Estimated Price</span>
                          <span className="text-[#B3A1C9] font-extrabold text-xl">
                            ₹{((Number(formData.price)||0) + (Number(formData.registrationFee)||0) + (Number(formData.stampDuty)||0) + (Number(formData.gst)||0) + (Number(formData.maintenanceFee)||0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location */}
                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1E2430] pb-4">Location & Area Reality Index (ARI)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>City</label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. Mumbai"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Neighborhood / Location</label>
                          <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. Bandra West"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Full Address</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Enter complete address details"
                        />
                      </div>
                      
                      <div className="bg-[#1E2430] p-6 rounded-2xl border border-[#322D40] space-y-4">
                        <h3 className="text-white font-bold mb-4">Area Reality Index (ARI) Ratings (1-10)</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Safety Score</label>
                            <input type="number" step="0.1" max="10" name="ariSafetyScore" value={formData.ariSafetyScore} onChange={handleChange} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Connectivity Score</label>
                            <input type="number" step="0.1" max="10" name="ariConnectivityScore" value={formData.ariConnectivityScore} onChange={handleChange} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Amenities Score</label>
                            <input type="number" step="0.1" max="10" name="ariAmenitiesScore" value={formData.ariAmenitiesScore} onChange={handleChange} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Pollution Score</label>
                            <input type="number" step="0.1" max="10" name="ariPollutionScore" value={formData.ariPollutionScore} onChange={handleChange} className={inputClass} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Area Summary</label>
                          <textarea name="ariSummary" value={formData.ariSummary} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Brief summary of the area..." />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Property Specs */}
                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1E2430] pb-4">Property Specifications</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>Property Type</label>
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="apartment">Apartment</option>
                            <option value="house">Independent House</option>
                            <option value="villa">Luxury Villa</option>
                            <option value="plot">Plot / Land</option>
                            <option value="commercial">Commercial Space</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Area (Sq. Ft.)</label>
                          <input
                            type="number"
                            name="areaSqft"
                            required
                            min="0"
                            value={formData.areaSqft}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. 1500"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Bedrooms</label>
                          <input
                            type="number"
                            name="bedrooms"
                            required
                            min="0"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. 3"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Bathrooms</label>
                          <input
                            type="number"
                            name="bathrooms"
                            required
                            min="0"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="e.g. 2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Media & Info */}
                  {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1E2430] pb-4">Media & Description</h2>
                      
                      <div>
                        <label className={labelClass}>Property Description</label>
                        <textarea
                          name="description"
                          required
                          value={formData.description}
                          onChange={handleChange}
                          rows={5}
                          className={`${inputClass} resize-none`}
                          placeholder="Describe the key features, amenities, and selling points of your property..."
                        />
                      </div>
                      
                      <div>
                        <label className={labelClass}>Property Images</label>
                        <p className="text-xs text-[#C8C5C7] mb-2">Upload up to 10 images (max 5MB each). First image will be the cover photo.</p>
                        
                        <div className="flex items-center justify-center w-full mb-4">
                          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#563F7C] border-dashed rounded-xl cursor-pointer bg-[#322D40] hover:bg-[#1E2430] transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImageIcon className="w-8 h-8 mb-2 text-[#C8C5C7]" />
                              <p className="mb-2 text-sm text-[#C8C5C7]"><span className="font-bold text-white">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-[#C8C5C7]/70">SVG, PNG, JPG or WEBP</p>
                            </div>
                            <input 
                              id="dropzone-file" 
                              type="file" 
                              className="hidden" 
                              multiple 
                              accept="image/png, image/jpeg, image/webp"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const filesArray = Array.from(e.target.files);
                                  setImageFiles(prev => [...prev, ...filesArray].slice(0, 10));
                                  
                                  const previews = filesArray.map(file => URL.createObjectURL(file));
                                  setImagePreviews(prev => [...prev, ...previews].slice(0, 10));
                                }
                              }} 
                            />
                          </label>
                        </div>
                        
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#563F7C]/50 h-24">
                                <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImageFiles(prev => prev.filter((_, i) => i !== idx));
                                    setImagePreviews(prev => {
                                      const newPreviews = [...prev];
                                      URL.revokeObjectURL(newPreviews[idx]);
                                      return newPreviews.filter((_, i) => i !== idx);
                                    });
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                {idx === 0 && (
                                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5 font-bold">
                                    COVER
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-10 pt-6 border-t border-[#1E2430] flex justify-between items-center">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-6 py-3 rounded-xl bg-[#1E2430] text-white font-bold border border-[#322D40] hover:bg-[#322D40] transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    {step < 4 ? (
                      <button
                        type="submit"
                        className="flex items-center px-8 py-3 rounded-xl bg-[#563F7C] text-white font-bold shadow-lg shadow-[#563F7C]/20 hover:bg-[#4A356A] transition-colors"
                      >
                        Next Step <ChevronRight className="w-5 h-5 ml-1" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-10 py-3 rounded-xl bg-[#563F7C] text-white font-bold shadow-lg shadow-[#563F7C]/20 hover:bg-[#4A356A] transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Publishing...' : 'Publish Property'} <CheckCircle className="w-5 h-5 ml-2" />
                      </button>
                    )}
                  </div>
                  
                </form>
              </div>
              
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
