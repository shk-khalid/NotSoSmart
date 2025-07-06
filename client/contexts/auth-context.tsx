// src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setUser, setAccessToken, logout as logoutAction } from '@/store/slices/auth-slice';
import { RootState } from '@/store';
import { useIdleTimer } from '@/hooks/use-idle-timer';
import authService, {
  RegisterRequest,
  ResetPasswordRequest,
} from '@/services/auth-service';
import { Loader } from 'lucide-react';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();  // ← use Next.js router
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // auto‑logout on inactivity
  useIdleTimer();

  // mark ready
  useEffect(() => {
    setHydrated(true);
  }, []);

  // attach token to axios
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.login({ email, password });
        const {
          access_token: token,
          user: { id, email: userEmail, username },
        } = data;

        dispatch(
          setUser({
            id: Number(id),
            username,
            email: userEmail,
          })
        );
        dispatch(setAccessToken(token));
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Sign‑out error:', err);
    } finally {
      dispatch(logoutAction());
      router.push('/login');    // ← redirect using Next.js
      setLoading(false);
    }
  }, [dispatch, router]);

  const register = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true);
      setError(null);
      try {
        await authService.register(data);
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      setLoading(true);
      setError(null);
      try {
        await authService.resetPassword(data);
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const isAuthenticated = Boolean(user && accessToken);

  if (!hydrated) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
