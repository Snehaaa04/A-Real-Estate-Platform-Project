'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { User, Mail, Shield, Calendar, Edit2, Check, X } from 'lucide-react';
import api from '@/lib/api';

export default function BuyerProfile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', formData);
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.reload(); // Quick way to update auth context
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 bg-[#1E2430] border border-[#322D40] rounded-xl focus:border-[#563F7C] outline-none text-white text-sm";

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <div className="min-h-screen bg-[#1E2430] flex font-sans">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            title="My Profile" 
            subtitle="Manage your personal details and preferences"
            showSearch={false}
          />
          
          <main className="flex-1 p-6 lg:p-10 lg:ml-64 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#322D40] rounded-3xl overflow-hidden border border-[#1E2430] shadow-lg relative">
                
                {/* Edit Button */}
                <div className="absolute top-4 right-4 z-10">
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-lg text-sm font-bold transition-colors border border-white/10">
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button onClick={() => setIsEditing(false)} disabled={loading} className="flex items-center px-4 py-2 bg-red-500/80 hover:bg-red-500 backdrop-blur text-white rounded-lg text-sm font-bold transition-colors border border-white/10">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={loading} className="flex items-center px-4 py-2 bg-green-500/80 hover:bg-green-500 backdrop-blur text-white rounded-lg text-sm font-bold transition-colors border border-white/10">
                        <Check className="w-4 h-4 mr-1" /> {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Header */}
                <div className="h-32 bg-gradient-to-r from-[#563F7C] to-[#322D40] relative"></div>
                
                <div className="px-8 pb-8">
                  <div className="relative flex justify-between items-end -mt-12 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#1E2430] border-4 border-[#322D40] flex items-center justify-center text-4xl font-bold text-[#B3A1C9] shadow-xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="bg-[#563F7C]/20 text-[#B3A1C9] border border-[#563F7C]/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center">
                      <Shield className="w-4 h-4 mr-1.5" />
                      Buyer Account
                    </div>
                  </div>

                  {!isEditing ? (
                    <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
                  ) : (
                    <input name="name" value={formData.name} onChange={handleChange} className={`${inputClass} text-2xl font-bold mb-1 max-w-xs`} placeholder="Full Name" />
                  )}
                  
                  <div className="flex items-center text-[#C8C5C7] mb-8 mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email} <span className="ml-2 text-xs opacity-50">(Email cannot be changed)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#1E2430]">
                    <div className="bg-[#1E2430] rounded-xl p-5 border border-[#322D40]">
                      <div className="flex items-center mb-4 text-[#B3A1C9]">
                        <User className="w-5 h-5 mr-2" />
                        <h3 className="font-bold">Account Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold mb-1">Phone Number</p>
                          {!isEditing ? <p className="text-white">{user.phoneNumber || 'Not provided'}</p> : <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />}
                        </div>
                        <div>
                          <p className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold mb-1">Gender</p>
                          {!isEditing ? <p className="text-white capitalize">{user.gender || 'Not provided'}</p> : (
                            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold mb-1">City & State</p>
                          {!isEditing ? <p className="text-white">{(user.city || user.state) ? `${user.city || ''}, ${user.state || ''}` : 'Not provided'}</p> : (
                            <div className="flex space-x-2">
                              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className={inputClass} />
                              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className={inputClass} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-[#C8C5C7] uppercase tracking-wider font-bold mb-1">Pincode</p>
                          {!isEditing ? <p className="text-white">{user.pincode || 'Not provided'}</p> : <input name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1E2430] rounded-xl p-5 border border-[#322D40]">
                      <div className="flex items-center mb-4 text-[#B3A1C9]">
                        <Calendar className="w-5 h-5 mr-2" />
                        <h3 className="font-bold">Account Activity</h3>
                      </div>
                      <div className="flex flex-col h-full justify-center text-center p-4 border border-dashed border-[#322D40] rounded-lg">
                        <p className="text-[#C8C5C7] text-sm">Account created recently.</p>
                        <p className="text-[#C8C5C7] text-sm mt-2">More activity stats will appear here as you interact with properties.</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
