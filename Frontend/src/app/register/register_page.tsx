'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { User, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      setIsFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setState(postOffice.State);
          setCity(postOffice.District || postOffice.Block);
        } else {
          setError('Invalid Pincode. Please enter manually.');
        }
      } catch (err) {
        setError('Failed to fetch pincode details.');
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { 
        name, email, phoneNumber, password, role, gender, state, city, pincode 
      });
      login(response.data);
      if (response.data.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1E2430] font-sans">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E2430] items-center justify-center overflow-hidden border-r border-[#322D40]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1E2430] via-transparent to-[#1E2430]/50"></div>
        
        <div className="relative z-10 p-12 max-w-lg text-left">
          <Logo className="mb-12" />
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Join the exclusive network of premium real estate.
          </h2>
          <p className="text-lg text-[#C8C5C7] font-light mb-8">
            Whether you're looking for your dream home or listing a luxury property, we provide the platform to negotiate seamlessly.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center flex justify-center">
            <Logo />
          </div>
          
          <div className="bg-[#322D40] p-8 rounded-2xl shadow-2xl border border-[#1E2430]">
            <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-sm text-[#C8C5C7] mb-8">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#B3A1C9] hover:text-white transition-colors">
                Sign in
              </Link>
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-medium text-center border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#C8C5C7] mb-3">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setRole('buyer')}
                    className={`cursor-pointer rounded-xl border border-[#1E2430] p-4 flex flex-col items-center transition-all ${
                      role === 'buyer' 
                        ? 'border-[#563F7C] bg-[#563F7C]/10' 
                        : 'bg-[#1E2430] hover:border-[#322D40]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mb-2 ${
                      role === 'buyer' ? 'border-[#563F7C]' : 'border-[#322D40]'
                    }`}>
                      {role === 'buyer' && <div className="w-2 h-2 bg-[#563F7C] rounded-full"></div>}
                    </div>
                    <span className={`font-semibold ${role === 'buyer' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`}>Buy Properties</span>
                  </div>
                  
                  <div 
                    onClick={() => setRole('seller')}
                    className={`cursor-pointer rounded-xl border border-[#1E2430] p-4 flex flex-col items-center transition-all ${
                      role === 'seller' 
                        ? 'border-[#563F7C] bg-[#563F7C]/10' 
                        : 'bg-[#1E2430] hover:border-[#322D40]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mb-2 ${
                      role === 'seller' ? 'border-[#563F7C]' : 'border-[#322D40]'
                    }`}>
                      {role === 'seller' && <div className="w-2 h-2 bg-[#563F7C] rounded-full"></div>}
                    </div>
                    <span className={`font-semibold ${role === 'seller' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`}>List Properties</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#C8C5C7] mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setGender('male')}
                    className={`cursor-pointer rounded-xl border border-[#1E2430] p-4 flex items-center justify-center transition-all ${
                      gender === 'male' 
                        ? 'border-[#563F7C] bg-[#563F7C]/10' 
                        : 'bg-[#1E2430] hover:border-[#322D40]'
                    }`}
                  >
                    <User className={`w-5 h-5 mr-2 ${gender === 'male' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`} />
                    <span className={`font-semibold ${gender === 'male' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`}>Male</span>
                  </div>
                  
                  <div 
                    onClick={() => setGender('female')}
                    className={`cursor-pointer rounded-xl border border-[#1E2430] p-4 flex items-center justify-center transition-all ${
                      gender === 'female' 
                        ? 'border-[#563F7C] bg-[#563F7C]/10' 
                        : 'bg-[#1E2430] hover:border-[#322D40]'
                    }`}
                  >
                    <User className={`w-5 h-5 mr-2 ${gender === 'female' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`} />
                    <span className={`font-semibold ${gender === 'female' ? 'text-[#B3A1C9]' : 'text-[#C8C5C7]'}`}>Female</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="9876543210"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#C8C5C7] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#C8C5C7] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isFetchingPincode}
                    className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50 disabled:opacity-50"
                    placeholder="Mumbai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isFetchingPincode}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50 disabled:opacity-50"
                  placeholder="Maharashtra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="Create a strong password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#563F7C]/20 text-sm font-bold text-white bg-[#563F7C] hover:bg-[#4A356A] focus:outline-none disabled:opacity-70 transition-all"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
