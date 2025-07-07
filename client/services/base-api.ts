import axios from "axios";

// Utility function to extract a cookie by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Utility function to get token from localStorage
function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Try to get token from localStorage first, then cookies
  const accessToken = getTokenFromStorage() || getCookie('authToken');
  
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refresh_token') || getCookie('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/refresh/`, {
            refresh_token: refreshToken
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          document.cookie = 'authToken=; Max-Age=0; path=/;';
          document.cookie = 'refresh_token=; Max-Age=0; path=/;';
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      } else {
        // No refresh token, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;