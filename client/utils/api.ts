import { Task, Category, ContextEntry, AISuggestionInput, AISuggestionResponse, TaskStatus } from '@/types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base URL for API - in production, this would come from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('access_token', response.access_token);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async register(userData: { username: string; email: string; password: string }): Promise<{ message: string }> {
    const response = await this.client.post('/api/auth/register/', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post('/api/auth/login/', credentials);
    return response.data;
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    const response = await this.client.post('/api/auth/reset-password/', { email });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await this.client.post('/api/auth/refresh/', { refresh_token: refreshToken });
    return response.data;
  }

  async getCurrentUser(): Promise<{ id: number; username: string; email: string }> {
    const response = await this.client.get('/api/auth/user/');
    return response.data;
  }

  // Task API methods
  async getTasks(): Promise<Task[]> {
    const response = await this.client.get('/api/tasks/');
    return response.data;
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.client.get(`/api/tasks/${id}/`);
    return response.data;
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const response = await this.client.post('/api/tasks/', task);
    return response.data;
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await this.client.put(`/api/tasks/${id}/`, task);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.delete(`/api/tasks/${id}/`);
  }

  // Category API methods
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get('/api/categories/');
    return response.data;
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await this.client.post('/api/categories/', category);
    return response.data;
  }

  // Context API methods
  async getContexts(): Promise<ContextEntry[]> {
    const response = await this.client.get('/api/contexts/');
    return response.data;
  }

  async createContext(context: Omit<ContextEntry, 'id' | 'created_at'>): Promise<ContextEntry> {
    const response = await this.client.post('/api/contexts/', context);
    return response.data;
  }

  // AI Suggestion API
  async getAISuggestions(input: AISuggestionInput): Promise<AISuggestionResponse> {
    const response = await this.client.post('/api/suggestions/', input);
    return response.data;
  }
}

export const apiClient = new ApiClient(BASE_URL);

// Utility functions for mock data during development
export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Write and submit the quarterly project proposal for the new client",
    category: { id: 1, name: "Work" },
    priority_score: 8,
    deadline: "2025-01-15",
    status: "pending",
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Get milk, bread, eggs, and vegetables for the week",
    category: { id: 2, name: "Personal" },
    priority_score: 4,
    deadline: "2025-01-12",
    status: "completed",
    created_at: "2025-01-10T11:00:00Z",
    updated_at: "2025-01-10T11:00:00Z"
  },
  {
    id: 3,
    title: "Prepare presentation",
    description: "Create slides for the team meeting next week",
    category: { id: 1, name: "Work" },
    priority_score: 6,
    deadline: "2025-01-18",
    status: "in_progress",
    created_at: "2025-01-10T12:00:00Z",
    updated_at: "2025-01-10T12:00:00Z"
  }
];

export const mockCategories: Category[] = [
  { id: 1, name: "Work" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Health" },
  { id: 4, name: "Learning" }
];

export const mockContexts: ContextEntry[] = [
  {
    id: 1,
    content: "Remember to call the client about the project deadline",
    source_type: "note",
    created_at: "2025-01-10T09:00:00Z"
  },
  {
    id: 2,
    content: "Meeting with team lead tomorrow at 2 PM",
    source_type: "whatsapp",
    created_at: "2025-01-10T14:00:00Z"
  }
];