import axiosInstance from '@/services/base-api';
import { Task, Category, ContextEntry, AISuggestionInput, AISuggestionResponse, TaskStatus } from '@/types';

export interface CreateTaskRequest {
  title: string;
  description: string;
  category?: number | null;
  priority_score: number;
  deadline?: string | null;
  status: TaskStatus;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: number;
}

export interface CreateContextRequest {
  content: string;
  source_type: 'whatsapp' | 'email' | 'note';
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CategorizeRequest {
  title: string;
  description: string;
}

export interface CategorizeResponse {
  suggested_category: string;
}

const todoService = {
  // Task operations
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await axiosInstance.get<Task[]>('/api/tasks/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to fetch tasks');
    }
  },

  getTask: async (id: number): Promise<Task> => {
    try {
      const response = await axiosInstance.get<Task>(`/api/tasks/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching task:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to fetch task');
    }
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await axiosInstance.post<Task>('/api/tasks/', taskData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating task:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create task');
    }
  },

  updateTask: async (id: number, taskData: Partial<CreateTaskRequest>): Promise<Task> => {
    try {
      const response = await axiosInstance.put<Task>(`/api/tasks/${id}/`, taskData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating task:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to update task');
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/tasks/${id}/`);
    } catch (error: any) {
      console.error('Error deleting task:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to delete task');
    }
  },

  // Category operations
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get<Category[]>('/api/categories/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to fetch categories');
    }
  },

  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    try {
      const response = await axiosInstance.post<Category>('/api/categories/', categoryData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating category:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create category');
    }
  },

  updateCategory: async (id: number, categoryData: Partial<CreateCategoryRequest>): Promise<Category> => {
    try {
      const response = await axiosInstance.put<Category>(`/api/categories/${id}/`, categoryData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating category:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to update category');
    }
  },

  deleteCategory: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/categories/${id}/`);
    } catch (error: any) {
      console.error('Error deleting category:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to delete category');
    }
  },

  // Context operations
  getContexts: async (): Promise<ContextEntry[]> => {
    try {
      const response = await axiosInstance.get<ContextEntry[]>('/api/contexts/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching contexts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to fetch contexts');
    }
  },

  createContext: async (contextData: CreateContextRequest): Promise<ContextEntry> => {
    try {
      const response = await axiosInstance.post<ContextEntry>('/api/contexts/', contextData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating context:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create context');
    }
  },

  updateContext: async (id: number, contextData: Partial<CreateContextRequest>): Promise<ContextEntry> => {
    try {
      const response = await axiosInstance.put<ContextEntry>(`/api/contexts/${id}/`, contextData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating context:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to update context');
    }
  },

  deleteContext: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/contexts/${id}/`);
    } catch (error: any) {
      console.error('Error deleting context:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to delete context');
    }
  },

  // AI and Smart features
  suggestCategory: async (data: CategorizeRequest): Promise<CategorizeResponse> => {
    try {
      const response = await axiosInstance.post<CategorizeResponse>('/api/tasks/suggest-category/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error getting category suggestion:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to get category suggestion');
    }
  },

  getAISuggestions: async (data: AISuggestionInput): Promise<AISuggestionResponse> => {
    try {
      const response = await axiosInstance.post<AISuggestionResponse>('/api/ai/suggestions/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error getting AI suggestions:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to get AI suggestions');
    }
  },
};

export default todoService;