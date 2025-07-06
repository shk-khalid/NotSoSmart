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
    // stub
    return {} as RegisterResponse;
  },
  resetPassword: async () => {
    // stub
    return {} as ResetPasswordResponse;
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
        if (accessToken && user) {
          setLoading(false);
          return;
        }

        // Force token to string|null
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
          // Optionally fetch user info here
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

        dispatch(
          setUser({
            id,
            username,
            email: userEmail,
          })
        );
        dispatch(setAccessToken(token));

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