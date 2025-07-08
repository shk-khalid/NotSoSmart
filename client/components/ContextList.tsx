"use client";

import { ContextEntry, ContextSource } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, StickyNote, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextListProps {
  contexts: ContextEntry[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function ContextList({ contexts, onDelete, isLoading = false }: ContextListProps) {
  const getSourceIcon = (sourceType: ContextSource) => {
    switch (sourceType) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <StickyNote className="h-4 w-4" />;
    }
  };

  const getSourceColor = (sourceType: ContextSource) => {
    switch (sourceType) {
      case 'whatsapp':
        return 'bg-green-500 text-white';
      case 'email':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-purple-500 text-white';
    }
  };

  const getSourceBorderColor = (sourceType: ContextSource) => {
    switch (sourceType) {
      case 'whatsapp':
        return 'border-l-green-500';
      case 'email':
        return 'border-l-blue-500';
      default:
        return 'border-l-purple-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
          <CardTitle className="text-deep-plum">Context Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rich-mauve mx-auto"></div>
            <p className="mt-4 text-sm text-rich-mauve">Loading contexts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contexts.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
          <CardTitle className="text-deep-plum">Context Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center mx-auto mb-4">
              <StickyNote className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-deep-plum mb-2">No context entries yet</h3>
            <p className="text-rich-mauve mb-4">Add your first context entry to help AI provide better suggestions.</p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 Context entries help the AI understand your work patterns and provide more accurate task suggestions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
        <CardTitle className="flex items-center justify-between text-deep-plum">
          <span>Context Entries</span>
          <Badge variant="outline" className="border-rich-mauve text-rich-mauve bg-white/50">
            {contexts.length} entries
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {contexts.map((context) => (
            <div
              key={context.id}
              className={cn(
                "p-4 rounded-xl border-l-4 bg-gradient-to-r from-gray-50 to-white group hover:from-gray-100 hover:to-gray-50 transition-all duration-200 shadow-sm hover:shadow-md",
                getSourceBorderColor(context.source_type)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getSourceColor(context.source_type)} shadow-sm`}>
                      {getSourceIcon(context.source_type)}
                      <span className="ml-1 capitalize">{context.source_type}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-rich-mauve">
                      <Clock className="h-3 w-3" />
                      {new Date(context.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {context.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(context.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-100 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}