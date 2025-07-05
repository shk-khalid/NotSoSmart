// Authentication service with dummy implementation
// Real API calls are commented out for future implementation

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Dummy login implementation
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy validation - accept any email/password for demo
    if (email && password) {
      return {
        success: true,
        token: 'dummy_jwt_token_' + Date.now(),
        user: {
          id: 1,
          username: email.split('@')[0],
          email: email
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
    
    /* Real API implementation (commented out):
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          token: data.access_token,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
    */
  }

  // Dummy register implementation
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Dummy validation
    if (username && email && password) {
      return {
        success: true,
        message: 'Account created successfully'
      };
    }
    
    return {
      success: false,
      message: 'Registration failed. Please check your information.'
    };
    
    /* Real API implementation (commented out):
    try {
      const response = await fetch(`${this.baseURL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: 'Account created successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
    */
  }

  // Dummy reset password implementation
  async resetPassword(email: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy validation
    if (email) {
      return {
        success: true,
        message: 'Password reset email sent'
      };
    }
    
    return {
      success: false,
      message: 'Please provide a valid email address'
    };
    
    /* Real API implementation (commented out):
    try {
      const response = await fetch(`${this.baseURL}/api/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: 'Password reset email sent'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to send reset email'
        };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
    */
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  // Get current user token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Logout user
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/landing';
    }
  }

  // Get user info from token (dummy implementation)
  getCurrentUser(): { id: number; username: string; email: string } | null {
    const token = this.getToken();
    if (!token) return null;
    
    // In a real app, you would decode the JWT token or make an API call
    return {
      id: 1,
      username: 'demo_user',
      email: 'demo@example.com'
    };
  }
}

export const authService = new AuthService();

// Auth guard hook for protecting routes
export const useAuthGuard = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (typeof window !== 'undefined' && !isAuthenticated) {
    window.location.href = '/landing';
  }
  
  return isAuthenticated;
};

// Redirect authenticated users away from auth pages
export const useGuestGuard = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (typeof window !== 'undefined' && isAuthenticated) {
    window.location.href = '/';
  }
  
  return !isAuthenticated;
};