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
  register: (data: RegisterRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
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
  const router = useRouter();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // auto‑logout on inactivity
  useIdleTimer();

  // Check for existing auth on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Check if we have a token in Redux store
        if (accessToken && user) {
          setLoading(false);
          return;
        }

        // Check for token in localStorage or cookies as fallback
        let token = localStorage.getItem('access_token');
        
        if (!token) {
          token = document.cookie
            .split('; ')
            .find(row => row.startsWith('authToken='))
            ?.split('=')[1];
        }

        if (token) {
          // For now, just set the token without validating
          // In a real app, you'd validate with the backend
          dispatch(setAccessToken(token));
          
          // You could also try to get user info here
          // const userInfo = await getUserInfo(token);
          // dispatch(setUser(userInfo));
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, [dispatch, accessToken, user]);

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
        
        console.log('Login response:', data); // Debug log
        
        const {
          access_token: token,
          user: { id, email: userEmail, username },
        } = data;

        dispatch(
          setUser({
            id: id, // Keep as string since Supabase uses string IDs
            username,
            email: userEmail,
          })
        );
        dispatch(setAccessToken(token));
        
        // Redirect to dashboard after successful login
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
      dispatch(logoutAction());
      router.push('/');
      setLoading(false);
    }
  }, [dispatch, router]);

  const register = useCallback(
    async (data: RegisterRequest) => {
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
    async (data: ResetPasswordRequest) => {
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