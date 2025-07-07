"use client";

import { useAuth } from '@/contexts/auth-context';
import LandingPage from './landing/page';
import Dashboard from './dashboard/page';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we're authenticated and on the root path, redirect to dashboard
    if (isAuthenticated && window.location.pathname === '/') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pale-oat via-dusty-blush to-rose-fog flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum-twilight mx-auto mb-4"></div>
          <p className="text-mist-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard, otherwise show landing
  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}