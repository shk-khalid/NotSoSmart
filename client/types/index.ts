export interface Category {
  id: number;
  name: string;
}

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  category: Category | null;
  priority_score: number;
  deadline: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface AISuggestionInput {
  title: string;
  description: string;
  category?: string;
  context_data: string[];
}

export interface AISuggestionResponse {
  enhanced_description: string;
  suggested_deadline: string;
  suggested_category: string;
  priority_score: number;
}

export type ContextSource = "whatsapp" | "email" | "note";

export interface ContextEntry {
  id: number;
  content: string;
  source_type: ContextSource;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface FilterOptions {
  status: TaskStatus | 'all';
  category: number | 'all';
  priority: 'high' | 'medium' | 'low' | 'all';
}