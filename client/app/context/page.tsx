"use client";

import { useState, useEffect } from 'react';
import { ContextEntry, ContextSource } from '@/types';
import { ContextForm } from '@/components/ContextForm';
import { ContextList } from '@/components/ContextList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, Calendar, FileText, AlertCircle } from 'lucide-react';
import todoService from '@/services/todo-service';
import toast from 'react-hot-toast';

export default function ContextPage() {
  const [contexts, setContexts] = useState<ContextEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Load contexts from backend
  useEffect(() => {
    const loadContexts = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const contextsData = await todoService.getContexts();
        setContexts(contextsData);
      } catch (error: any) {
        console.error('Error loading contexts:', error);
        setError(error.message || 'Failed to load context entries. Please try again.');
        toast.error(error.message || 'Failed to load contexts');
      } finally {
        setIsLoading(false);
      }
    };

    loadContexts();
  }, []);


  const handleAddContext = async (content: string, source: ContextSource) => {
    try {
      setError(null);
      const newContext = await todoService.createContext({
        content,
        source_type: source,
      });
      
      setContexts(prev => [newContext, ...prev]);
      toast.success('Context entry added successfully');
    } catch (error: any) {
      console.error('Error adding context:', error);
      setError(error.message || 'Failed to add context entry. Please try again.');
      toast.error(error.message || 'Failed to add context entry');
    }
  };

  const handleDeleteContext = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this context entry?')) {
      try {
        setError(null);
        await todoService.deleteContext(id);
        setContexts(prev => prev.filter(context => context.id !== id));
        toast.success('Context entry deleted successfully');
      } catch (error: any) {
        console.error('Error deleting context:', error);
        setError(error.message || 'Failed to delete context entry. Please try again.');
        toast.error(error.message || 'Failed to delete context entry');
      }
    }
  };

  // Calculate context statistics
  const contextStats = {
    total: contexts.length,
    whatsapp: contexts.filter(c => c.source_type === 'whatsapp').length,
    email: contexts.filter(c => c.source_type === 'email').length,
    note: contexts.filter(c => c.source_type === 'note').length,
    thisWeek: contexts.filter(c => {
      const contextDate = new Date(c.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return contextDate > weekAgo;
    }).length,
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Context Management</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Capture and organize your ideas, messages, and notes</p>
        </div>
        
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Context</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Context Management</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Capture and organize your ideas, messages, and notes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Entries</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{contextStats.total}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">WhatsApp</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{contextStats.whatsapp}</p>
              </div>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Email</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{contextStats.email}</p>
              </div>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{contextStats.thisWeek}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Context Form */}
        <div className="order-2 xl:order-1">
          <ContextForm
            onSubmit={handleAddContext}
            isLoading={isLoading}
          />
        </div>

        {/* Context List */}
        <div className="order-1 xl:order-2">
          <ContextList
            contexts={contexts}
            onDelete={handleDeleteContext}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Usage Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-lg sm:text-xl">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Context Types</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• <strong>WhatsApp:</strong> Messages and ideas from chats</li>
                <li>• <strong>Email:</strong> Important email content</li>
                <li>• <strong>Note:</strong> Personal thoughts and reminders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">AI Enhancement</h4>
              <ul className="space-y-1 text-blue-800">
                <li>• Context entries inform AI suggestions</li>
                <li>• More context = better task recommendations</li>
                <li>• AI learns from your patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}