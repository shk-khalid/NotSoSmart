"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckSquare } from 'lucide-react';
import Image from 'next/image';
import CheckLogo from "@/public/logo.png";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for route changes
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function(...args) {
      handleStart();
      originalPush.apply(window.history, args);
      setTimeout(handleComplete, 500); // Minimum loading time
    };

    window.history.replaceState = function(...args) {
      handleStart();
      originalReplace.apply(window.history, args);
      setTimeout(handleComplete, 500);
    };

    // Handle browser back/forward
    window.addEventListener('popstate', handleStart);
    
    // Cleanup
    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener('popstate', handleStart);
    };
  }, []);

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center"
        >
          <div className="text-center">
            {/* Logo and Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-xl flex items-center justify-center shadow-lg"
              >
                <Image src={CheckLogo} alt="Logo" width={24} height={24} />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-deep-plum">Smart Todo AI</span>
                <span className="text-sm font-light text-rich-mauve">Your Smart Todo Assistant</span>
              </div>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Spinner */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-rich-mauve border-t-transparent rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-8 h-8 border-2 border-deep-plum border-b-transparent rounded-full"
                />
              </div>

              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-rich-mauve font-medium"
              >
                Loading...
              </motion.p>

              {/* Progress Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-rich-mauve rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}