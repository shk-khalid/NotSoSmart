"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    const isAuthPage = pathname.startsWith('/auth');
    const isRootPage = pathname === '/';
    const isLandingPage = pathname === '/landing';

    // If not authenticated and trying to access protected routes
    if (!isAuthenticated && !isAuthPage && !isRootPage && !isLandingPage) {
      router.push('/auth/login');
      return;
    }

    // If authenticated and on auth pages, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-mauve mx-auto mb-4"></div>
          <p className="text-deep-plum">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}