'use client';

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

  // Define public routes in one place
  const publicRoutes = ['/', '/landing', '/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (loading) return; // auth not ready yet

    if (!isAuthenticated && !isPublicRoute) {
      // trying to hit a protected page → send to login
      router.replace('/auth/login');
      return;
    }

    if (isAuthenticated && pathname.startsWith('/auth')) {
      // no more hanging out on login/register once you’re in
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router, isPublicRoute]);

  // spinner while determining auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-mauve"></div>
      </div>
    );
  }

  // during a replace redirect, bail out
  if (!loading) {
    if (!isAuthenticated && !isPublicRoute) return null;
    if (isAuthenticated && pathname.startsWith('/auth')) return null;
  }

  return <>{children}</>;
}