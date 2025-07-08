"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/TaskForm';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Task, Category, AISuggestionInput, AISuggestionResponse } from '@/types';
import todoService from '@/services/todo-service';
import toast from 'react-hot-toast';

export default function CreateTaskPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await todoService.getCategories();
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  const handleSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Transform the data to match backend expectations
      const createTaskData = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category?.id || null,
        priority_score: taskData.priority_score,
        deadline: taskData.deadline,
        status: taskData.status,
      };

      await todoService.createTask(createTaskData);
      toast.success('Task created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating task:', error);
      setError(error.message || 'Failed to create task. Please try again.');
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIEnhance = async (data: AISuggestionInput) => {
    setError(null);
    
    try {
      const suggestions = await todoService.getAISuggestions(data);
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated!');
    } catch (error: any) {
      console.error('Error getting AI suggestions:', error);
      setError(error.message || 'Failed to get AI suggestions. Please try again.');
      toast.error(error.message || 'Failed to get AI suggestions');
    }
  };

  const handleAcceptSuggestions = () => {
    setAiSuggestions(null);
  };

  const handleRejectSuggestions = () => {
    setAiSuggestions(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <LoadingSpinner size="lg" text="Creating your task..." />
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-2">Add a new task with AI-powered enhancement</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {aiSuggestions && (
        <AISuggestionBox
          suggestions={aiSuggestions}
          onAccept={handleAcceptSuggestions}
          onReject={handleRejectSuggestions}
        />
      )}

      <TaskForm
        categories={categories}
        onSave={handleSave}
        onCancel={() => router.push('/dashboard')}
        onAIEnhance={handleAIEnhance}
        isLoading={isLoading}
        aiSuggestions={aiSuggestions}
      />
    </div>
  );
}