"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check once auth-context is done loading
    if (loading) return;

    if (!isAuthenticated) {
      // Skip redirect on landing or auth pages
      if (pathname !== '/' && !pathname.startsWith('/auth')) {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

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

  // If still not authed, render nothing (we already navigated away)
  if (!isAuthenticated && pathname !== '/' && !pathname.startsWith('/auth')) {
    return null;
  }

  return <>{children}</>;
}
