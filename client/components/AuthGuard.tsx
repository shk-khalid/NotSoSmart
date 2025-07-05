"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Define public routes that don't require authentication
      const publicRoutes = ['/landing', '/auth/login', '/auth/register', '/auth/reset-password'];
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
      
      if (!authenticated && !isPublicRoute) {
        // Redirect to landing page if not authenticated and trying to access protected route
        router.push('/landing');
      } else if (authenticated && (pathname.startsWith('/auth/') || pathname === '/landing')) {
        // Redirect to dashboard if authenticated and trying to access auth pages
        router.push('/');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}