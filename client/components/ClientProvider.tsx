'use client';

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { usePathname } from 'next/navigation';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  // decide whether to show navigation
  const isAuthPage = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/landing';
  const isRootPage = pathname === '/';
  const showNav = !isAuthPage && !isLandingPage && isAuthenticated && !isRootPage;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-mauve mx-auto mb-4" />
          <p className="text-deep-plum">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
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
            success: {
              duration: 3000,
              iconTheme: { primary: '#10b981', secondary: '#dbcbc1' },
            },
            error: {
              duration: 5000,
              iconTheme: { primary: '#ef4444', secondary: '#dbcbc1' },
            },
          }}
        />
        <ProtectedRoute>
          {showNav ? (
            <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose">
              <Navigation />
              <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
                {children}
              </main>
            </div>
          ) : (
            children
          )}
        </ProtectedRoute>
      </AuthProvider>
    </Provider>
  );
}
