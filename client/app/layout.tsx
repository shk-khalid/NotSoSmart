"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const inter = Inter({ subsets: ['latin'] });

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  
  // Don't show navigation on auth pages or landing page when not authenticated
  const isAuthPage = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/' && !isAuthenticated;
  const shouldShowNavigation = !isAuthPage && !isLandingPage && isAuthenticated;

  // Show loading state
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

  return (
    <ProtectedRoute>
      {shouldShowNavigation ? (
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
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#dbcbc1',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#dbcbc1',
                  },
                },
              }}
            />
            
            <AppContent>{children}</AppContent>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}