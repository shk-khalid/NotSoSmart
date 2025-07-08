"use client";

import { useState, useEffect } from 'react';
import { ContextEntry, ContextSource } from '@/types';
import { ContextForm } from '@/components/ContextForm';
import { ContextList } from '@/components/ContextList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, TrendingUp, FileText, AlertCircle, Mail, StickyNote, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 border-warm-beige shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-deep-plum mb-2">Error Loading Context</h3>
              <p className="text-rich-mauve mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-rich-mauve text-white px-4 py-2 rounded-lg hover:bg-deep-plum transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-deep-plum">Context Management</h1>
          <p className="text-rich-mauve mt-2 text-base lg:text-lg">Capture and organize your ideas, messages, and notes for AI enhancement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Total Entries</p>
                  <p className="text-2xl lg:text-3xl font-bold text-deep-plum">{contextStats.total}</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">WhatsApp</p>
                  <p className="text-2xl lg:text-3xl font-bold text-green-600">{contextStats.whatsapp}</p>
                </div>
                <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Email</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600">{contextStats.email}</p>
                </div>
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Notes</p>
                  <p className="text-2xl lg:text-3xl font-bold text-purple-600">{contextStats.note}</p>
                </div>
                <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <StickyNote className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">This Week</p>
                  <p className="text-2xl lg:text-3xl font-bold text-orange-600">{contextStats.thisWeek}</p>
                </div>
                <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
            <CardTitle className="text-blue-900 text-xl flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              💡 Pro Tips for Better AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 text-lg">Context Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">WhatsApp</p>
                      <p className="text-sm text-green-700">Messages and ideas from chats</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Email</p>
                      <p className="text-sm text-blue-700">Important email content and tasks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <StickyNote className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">Note</p>
                      <p className="text-sm text-purple-700">Personal thoughts and reminders</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 text-lg">AI Enhancement Benefits</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Context entries inform AI task suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">More context = better task recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">AI learns from your patterns and preferences</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Automatic priority and deadline suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Smart category predictions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}