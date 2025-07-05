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
        return 'bg-gray-500 text-white';
    }
  };

  const getSourceBorderColor = (sourceType: ContextSource) => {
    switch (sourceType) {
      case 'whatsapp':
        return 'border-l-green-500';
      case 'email':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Context Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading contexts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contexts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Context Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No context entries yet.</p>
            <p className="text-sm text-gray-400 mt-1">Add your first context entry to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Context Entries</span>
          <Badge variant="outline">{contexts.length} entries</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contexts.map((context) => (
            <div
              key={context.id}
              className={cn(
                "p-4 rounded-lg border-l-4 bg-gray-50 group hover:bg-gray-100 transition-colors",
                getSourceBorderColor(context.source_type)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSourceColor(context.source_type)}>
                      {getSourceIcon(context.source_type)}
                      <span className="ml-1 capitalize">{context.source_type}</span>
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(context.created_at).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {context.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(context.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-100"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}