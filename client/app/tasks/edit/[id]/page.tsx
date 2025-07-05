"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/TaskForm';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { Task, Category, AISuggestionInput, AISuggestionResponse } from '@/types';
import { mockTasks, mockCategories } from '@/utils/api';

interface EditTaskPageProps {
  params: { id: string };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [categories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setError(null);
        const taskId = parseInt(params.id);
        
        if (isNaN(taskId)) {
          setError('Invalid task ID');
          return;
        }
        
        const foundTask = mockTasks.find(t => t.id === taskId);
        
        if (!foundTask) {
          setError('Task not found');
          return;
        }
        
        setTask(foundTask);
      } catch (error) {
        console.error('Error loading task:', error);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [params.id]);

  const handleSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call the API here
      console.log('Updating task:', taskData);
      
      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIEnhance = async (data: AISuggestionInput) => {
    setError(null);
    
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI suggestions
      const mockSuggestions: AISuggestionResponse = {
        enhanced_description: `${data.description}\n\nAI Enhanced: This task has been updated with additional context and recommendations. Consider the latest requirements and stakeholder feedback.`,
        suggested_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggested_category: data.category || 'Work',
        priority_score: Math.floor(Math.random() * 10) + 1,
      };
      
      setAiSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setError('Failed to get AI suggestions. Please try again.');
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
            onClick={() => router.push('/')}
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
        onCancel={() => router.push('/')}
        onAIEnhance={handleAIEnhance}
        isLoading={isLoading}
        aiSuggestions={aiSuggestions}
      />
    </div>
  );
}