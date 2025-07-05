"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/TaskForm';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { Task, Category, AISuggestionInput, AISuggestionResponse } from '@/types';
import { mockCategories } from '@/utils/api';

export default function CreateTaskPage() {
  const router = useRouter();
  const [categories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call the API here
      console.log('Creating task:', taskData);
      
      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
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
        enhanced_description: `${data.description}\n\nAI Enhanced: This task involves coordinating with stakeholders, preparing materials, and ensuring timely delivery. Consider breaking it down into smaller subtasks for better management.`,
        suggested_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    // Suggestions are already applied in the TaskForm component
    setAiSuggestions(null);
  };

  const handleRejectSuggestions = () => {
    setAiSuggestions(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        onCancel={() => router.push('/')}
        onAIEnhance={handleAIEnhance}
        isLoading={isLoading}
        aiSuggestions={aiSuggestions}
      />
    </div>
  );
}