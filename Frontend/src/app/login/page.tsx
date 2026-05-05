'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Login() {
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRoleSelect = (selectedRole: 'buyer' | 'seller') => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { identifier, password, role });
      login(response.data);
      if (response.data.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1E2430] font-sans">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E2430] items-center justify-center overflow-hidden border-r border-[#322D40]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1E2430] via-transparent to-[#1E2430]/20"></div>
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#563F7C]/30 blur-[100px]"></div>
        
        <div className="relative z-10 p-12 max-w-lg text-left">
          {/* Custom Large Logo for Login Page */}
          <div className="flex items-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#563F7C] to-[#4A356A] flex items-center justify-center mr-4 shadow-xl shadow-[#563F7C]/40 border border-[#563F7C]/50">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <span className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Clear<span className="text-[#B3A1C9]">Estate</span>
            </span>
          </div>
          
          <h2 className="text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
            Find.<br />
            <span className="text-[#B3A1C9] relative inline-block">
              Negotiate.
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-[#563F7C] to-transparent rounded-full"></span>
            </span><br />
            Close.
          </h2>
          <p className="text-lg text-[#C8C5C7] font-light border-l-2 border-[#563F7C] pl-4">
            Sign in to access premium properties and manage your active real estate negotiations in real-time.
          </p>
          
          <div className="mt-12 flex items-center bg-[#322D40] border border-[#322D40] p-4 rounded-xl w-max">
            <ShieldCheck className="w-5 h-5 text-[#B3A1C9] mr-3" />
            <span className="text-sm text-[#C8C5C7]">Secure end-to-end encrypted deal rooms</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 text-center flex justify-center">
            <Logo />
          </div>
          
          <div className="bg-[#322D40] p-8 rounded-2xl shadow-2xl shadow-[#563F7C]/5 border border-[#1E2430]">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-sm text-[#C8C5C7] mb-8">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-[#B3A1C9] hover:text-white transition-colors">
                Create one now
              </Link>
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-medium text-center border border-red-500/20">
                  {error}
                </div>
              )}
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-3">Sign in as</label>
                <div className="flex p-1 bg-[#1E2430] rounded-xl border border-[#322D40]">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('buyer')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      role === 'buyer' 
                        ? 'bg-[#563F7C] text-white shadow-md' 
                        : 'text-[#C8C5C7] hover:text-white'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('seller')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      role === 'seller' 
                        ? 'bg-[#563F7C] text-white shadow-md' 
                        : 'text-[#C8C5C7] hover:text-white'
                    }`}
                  >
                    Seller
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#C8C5C7] mb-2">Phone number or email</label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="name@example.com or 9876543210"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#C8C5C7]">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-[#B3A1C9] hover:text-white transition-colors">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-[#563F7C]/20 text-sm font-bold text-white bg-[#563F7C] hover:bg-[#4A356A] focus:outline-none disabled:opacity-70 transition-all"
                >
                  {loading ? 'Signing in...' : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
