"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TaskForm } from '@/components/TaskForm';
import { AISuggestionBox } from '@/components/AISuggestionBox';
import { Task, Category, AISuggestionInput, AISuggestionResponse } from '@/types';
import todoService from '@/services/todo-service';
import toast from 'react-hot-toast';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;

  // Coerce to single string
  const taskIdParam = Array.isArray(rawId)
    ? rawId[0]
    : rawId;

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
        if (!taskIdParam) {
          throw new Error('Missing task ID in URL');
        }

        const idNum = parseInt(taskIdParam, 10);
        if (isNaN(idNum)) {
          throw new Error('Invalid task ID');
        }

        // Parallel fetch
        const [taskData, categoriesData] = await Promise.all([
          todoService.getTask(idNum),
          todoService.getCategories(),
        ]);

        setTask(taskData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskIdParam]);

  const handleSave = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!task) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatePayload = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category?.id || null,
        priority_score: taskData.priority_score,
        deadline: taskData.deadline,
        status: taskData.status,
      };

      await todoService.updateTask(task.id, updatePayload);
      toast.success('Task updated successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
      toast.error(err.message || 'Failed to update task');
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
    } catch (err: any) {
      console.error('Error getting AI suggestions:', err);
      setError(err.message || 'Failed to get AI suggestions');
      toast.error(err.message || 'Failed to get AI suggestions');
    }
  };

  const handleAcceptSuggestions = () => setAiSuggestions(null);
  const handleRejectSuggestions = () => setAiSuggestions(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
