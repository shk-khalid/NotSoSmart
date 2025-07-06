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
  const { isAuthenticated } = useAuth();
  
  const isAuthPage = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/' && !isAuthenticated;

  return (
    <ProtectedRoute>
      {isAuthPage || isLandingPage ? (
        children
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-pale-oat via-dusty-blush to-rose-fog">
          <Navigation />
          <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
            {children}
          </main>
        </div>
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
                  background: '#4e395a',
                  color: '#f4ede9',
                  border: '1px solid #674b74',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#f4ede9',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#f4ede9',
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