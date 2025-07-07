'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { usePathname } from 'next/navigation';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLanding  = path === '/' || path === '/landing';
  const isAuthPage = path.startsWith('/auth');

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#674b74',
              color: '#dbcbc1',
              border: '1px solid #856287',
            },
            success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#dbcbc1' } },
            error:   { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#dbcbc1' } },
          }}
        />

        {isLanding || isAuthPage ? (
          // no nav, no guard
          <>{children}</>
        ) : (
          // everything else gets nav + auth
          <ProtectedRoute>
            <Navigation />
            <main className="container mx-auto px-4 py-6 max-w-7xl">
              {children}
            </main>
          </ProtectedRoute>
        )}
      </AuthProvider>
    </ReduxProvider>
  );
}
