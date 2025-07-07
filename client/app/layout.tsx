import './globals.css';
import { Inter } from 'next/font/google';
import ClientProviders from '@/components/ClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Not So Smart Todo',
  description: 'Organize your life with smart task suggestions, category predictions, and AI-enhanced productivity.',
  icons: {
    icon: '/logo.png',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}