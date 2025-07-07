// app/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import LandingPage from './landing/page';
import Dashboard from './dashboard/page';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum-twilight" />
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
