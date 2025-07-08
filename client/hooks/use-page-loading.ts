'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const usePageLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    // Create a custom router wrapper
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    // Override history methods to trigger loading
    window.history.pushState = function(...args) {
      handleStart();
      const result = originalPush.apply(window.history, args);
      // Add minimum loading time for better UX
      setTimeout(handleComplete, 300);
      return result;
    };

    window.history.replaceState = function(...args) {
      handleStart();
      const result = originalReplace.apply(window.history, args);
      setTimeout(handleComplete, 300);
      return result;
    };

    // Handle browser navigation
    window.addEventListener('popstate', handleStart);

    // Cleanup
    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener('popstate', handleStart);
    };
  }, []);

  // Reset loading when pathname changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return isLoading;
};