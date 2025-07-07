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
import { useRouter, usePathname } from 'next/navigation';
import {
  setUser,
  setAccessToken,
  logout as logoutAction,
} from '@/store/slices/auth-slice';
import { RootState } from '@/store';
import { useIdleTimer } from '@/hooks/use-idle-timer';
import authService, {
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/services/auth-service';

export interface AuthUser {
  id: string;
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
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {
    return {} as RegisterResponse;
  },
  resetPassword: async () => {
    return {} as ResetPasswordResponse;
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // auto‑logout on inactivity
  useIdleTimer();

  // Check for existing auth on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Check if we already have user and token in Redux
        if (accessToken && user) {
          setLoading(false);
          return;
        }

        // Try to get token from localStorage or cookies
        let token: string | null = localStorage.getItem('access_token');
        if (!token) {
          const match = document.cookie
            .split('; ')
            .find((row) => row.startsWith('authToken='))
            ?.split('=')[1];
          token = match ?? null;
        }

        if (token) {
          dispatch(setAccessToken(token));
          
          // Try to get user info from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              dispatch(setUser(userData));
            } catch (e) {
              console.error('Error parsing stored user data:', e);
            }
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, [dispatch, accessToken, user]);

  // Attach token to axios
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

        const userData = {
          id,
          username,
          email: userEmail,
        };

        dispatch(setUser(userData));
        dispatch(setAccessToken(token));

        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));

        // Navigate to dashboard
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Login error in context:', err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Sign‑out error:', err);
    } finally {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      dispatch(logoutAction());
      router.push('/');
      setLoading(false);
    }
  }, [dispatch, router]);

  const register = useCallback(
    async (data: RegisterRequest): Promise<RegisterResponse> => {
      setError(null);
      try {
        const response = await authService.register(data);
        return response;
      } catch (err: any) {
        setError(err);
        throw err;
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
      setError(null);
      try {
        const response = await authService.resetPassword(data);
        return response;
      } catch (err: any) {
        setError(err);
        throw err;
      }
    },
    []
  );

  const isAuthenticated = Boolean(user && accessToken);

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