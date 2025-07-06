'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout, updateLastActivity } from '@/store/slices/auth-slice';
import { RootState } from '@/store';
import authService from '@/services/auth-service';
import { toast } from 'react-hot-toast';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const useIdleTimer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const lastActivity = useSelector((state: RootState) => state.auth.lastActivity);
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events: Array<keyof WindowEventMap> = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ];
    const handleActivity = () => dispatch(updateLastActivity());

    events.forEach((e) => window.addEventListener(e, handleActivity));

    const interval = setInterval(() => {
      const now = Date.now();
      if (lastActivity && now - lastActivity > IDLE_TIMEOUT) {
        // server‑side logout
        authService.logout().catch(console.error);
        // clear redux auth state
        dispatch(logout());
        // redirect to login page
        router.push('/customer-login');
        toast.error('Session expired due to inactivity');
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearInterval(interval);
    };
  }, [dispatch, router, lastActivity, isAuthenticated]);
};
