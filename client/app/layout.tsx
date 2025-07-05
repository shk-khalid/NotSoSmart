import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { AuthGuard } from '@/components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NotSoSmart - Smart Todo List',
  description: 'AI-powered task management with context-aware suggestions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ConditionalNavigation />
            <ConditionalMain>
              {children}
            </ConditionalMain>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}

// Component to conditionally render navigation
function ConditionalNavigation() {
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname;
  const isAuthPage = pathname.startsWith('/auth/') || pathname === '/landing';
  
  if (isAuthPage) return null;
  
  return <Navigation />;
}

// Component to conditionally render main container
function ConditionalMain({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    return <main>{children}</main>;
  }
  
  const pathname = window.location.pathname;
  const isAuthPage = pathname.startsWith('/auth/') || pathname === '/landing';
  
  if (isAuthPage) {
    return <main>{children}</main>;
  }
  
  return (
    <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {children}
    </main>
  );
}