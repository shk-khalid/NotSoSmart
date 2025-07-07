// app/layout.tsx

export const metadata = {
  title: 'Not So Smart Todo',
  description: 'Organize your life with smart task suggestions, category predictions, and AI-enhanced productivity.',
  icons: { icon: '/logo.png' },
};

import './globals.css';
import { Inter } from 'next/font/google';
import ClientRoot from './client-root';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
