"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/TaskForm';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { Task, Category, AISuggestionInput, AISuggestionResponse } from '@/types';
import todoService from '@/services/todo-service';
import toast from 'react-hot-toast';

interface EditTaskPageProps {
  params: { id: string };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const taskId = parseInt(params.id);
        
        if (isNaN(taskId)) {
          setError('Invalid task ID');
          return;
        }
        
        // Load task and categories in parallel
        const [taskData, categoriesData] = await Promise.all([
          todoService.getTask(taskId),
          todoService.getCategories()
        ]);
        
        setTask(taskData);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error loading data:', error);
        setError(error.message || 'Failed to load task');
        toast.error(error.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  const handleSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!task) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Transform the data to match backend expectations
      const updateTaskData = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category?.id || null,
        priority_score: taskData.priority_score,
        deadline: taskData.deadline,
        status: taskData.status,
      };

      await todoService.updateTask(task.id, updateTaskData);
      toast.success('Task updated successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error updating task:', error);
      setError(error.message || 'Failed to update task. Please try again.');
      toast.error(error.message || 'Failed to update task');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-600 mt-2">Update your task with AI-powered enhancements</p>
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
        task={task}
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