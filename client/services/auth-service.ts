import axiosInstance from '@/services/base-api';

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordResponse {
    message: string;
}

const authService = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const res = await axiosInstance.post<RegisterResponse>('/api/auth/register/', data);
            return res.data;
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Registration failed');
        }
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const res = await axiosInstance.post<LoginResponse>('/api/auth/login/', credentials);
            
            // Store tokens in localStorage as backup
            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
            }
            if (res.data.refresh_token) {
                localStorage.setItem('refresh_token', res.data.refresh_token);
            }
            
            return res.data;
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        try {
            const res = await axiosInstance.post<ResetPasswordResponse>('/api/auth/reset-password/', data);
            return res.data;
        } catch (error: any) {
            console.error('Reset password error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to send reset email');
        }
    },

    logout: async (): Promise<void> => {
        try {
            // call your logout endpoint if you have one
            // await axiosInstance.post('/api/auth/logout/');
        } finally {
            // ensure client‑side tokens are cleared even if request fails
            document.cookie = 'authToken=; Max-Age=0; path=/;';
            document.cookie = 'refresh_token=; Max-Age=0; path=/;';
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    },
};

export default authService;