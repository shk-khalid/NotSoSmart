"use client";

import { useAuth } from '@/contexts/auth-context';
import LandingPage from './landing/page';
import Dashboard from './dashboard/page';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}