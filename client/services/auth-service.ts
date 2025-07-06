import axiosInstance from '@/services/base-api';
import { log } from 'console';

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
        [key: string]: any;
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
        const res = await axiosInstance.post<RegisterResponse>('/api/auth/register/', data);
        return res.data;
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const res = await axiosInstance.post<LoginResponse>('/api/auth/login/', credentials);
        return res.data;
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const res = await axiosInstance.post<ResetPasswordResponse>('/api/auth/reset-password/', data);
        return res.data;
    },

    logout: async (): Promise<void> => {
        try {
            // call your logout endpoint
            await axiosInstance.post('/api/auth/logout/');
        } finally {
            // ensure client‑side tokens are cleared even if request fails
            document.cookie = 'authToken=; Max-Age=0; path=/;';
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    },
};

export default authService;
