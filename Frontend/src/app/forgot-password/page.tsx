'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2430] font-sans p-6">
      <div className="w-full max-w-md">
        
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        
        <div className="bg-[#322D40] p-8 rounded-3xl shadow-2xl border border-[#1E2430]">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#563F7C]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#563F7C]/30 shadow-inner">
                  <Mail className="w-8 h-8 text-[#B3A1C9]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-[#C8C5C7] text-sm leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#C8C5C7] mb-2 uppercase tracking-wider text-xs">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#1E2430] focus:ring-1 focus:ring-[#563F7C] focus:border-[#563F7C] outline-none transition-all bg-[#1E2430] text-white placeholder-[#C8C5C7]/30"
                    placeholder="Enter your registered email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-[#563F7C]/20 text-sm font-bold text-white bg-[#563F7C] hover:bg-[#4A356A] transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
              <p className="text-[#C8C5C7] text-sm leading-relaxed mb-8">
                If an account exists for <span className="text-white font-bold">{email}</span>, password reset instructions will be sent shortly.
              </p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-[#1E2430] text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-bold text-[#C8C5C7] hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
