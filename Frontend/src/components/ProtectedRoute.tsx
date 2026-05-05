'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E2430] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#322D40] border-t-[#563F7C] rounded-full animate-spin"></div>
          <div className="mt-4 text-[#C8C5C7] font-medium tracking-wider text-sm uppercase">Loading</div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
