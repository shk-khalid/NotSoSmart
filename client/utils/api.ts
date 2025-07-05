import { Task, Category, ContextEntry, AISuggestionInput, AISuggestionResponse, TaskStatus } from '@/types';

// Base URL for API - in production, this would come from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Task API methods
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks/');
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/`);
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return this.request<Task>('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/api/tasks/${id}/`, {
      method: 'DELETE',
    });
  }

  // Category API methods
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories/');
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return this.request<Category>('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Context API methods
  async getContexts(): Promise<ContextEntry[]> {
    return this.request<ContextEntry[]>('/api/contexts/');
  }

  async createContext(context: Omit<ContextEntry, 'id' | 'created_at'>): Promise<ContextEntry> {
    return this.request<ContextEntry>('/api/contexts/', {
      method: 'POST',
      body: JSON.stringify(context),
    });
  }

  // AI Suggestion API
  async getAISuggestions(input: AISuggestionInput): Promise<AISuggestionResponse> {
    return this.request<AISuggestionResponse>('/api/suggestions/', {
      method: 'POST',
      body: JSON.stringify(input),
    });
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