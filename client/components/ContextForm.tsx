"use client";

import { useState } from 'react';
import { ContextSource } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Mail, StickyNote, Sparkles } from 'lucide-react';

interface ContextFormProps {
  onSubmit: (content: string, source: ContextSource) => void;
  isLoading?: boolean;
}

export function ContextForm({ onSubmit, isLoading = false }: ContextFormProps) {
  const [content, setContent] = useState('');
  const [source, setSource] = useState<ContextSource>('note');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim(), source);
      setContent('');
    }
  };

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

  const getSourceDescription = (sourceType: ContextSource) => {
    switch (sourceType) {
      case 'whatsapp':
        return 'Messages, ideas, or reminders from WhatsApp conversations';
      case 'email':
        return 'Important content from emails that need action';
      default:
        return 'Personal thoughts, ideas, or quick reminders';
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
        <CardTitle className="flex items-center gap-2 text-deep-plum">
          <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Add Context Entry
        </CardTitle>
        <p className="text-sm text-rich-mauve mt-1">
          Capture information that will help AI provide better task suggestions
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="source" className="text-deep-plum font-semibold">Source Type</Label>
            <Select value={source} onValueChange={(value) => setSource(value as ContextSource)}>
              <SelectTrigger className="h-12 border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-warm-beige shadow-lg">
                <SelectItem value="note" className="hover:bg-warm-beige/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <StickyNote className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Personal Note</p>
                      <p className="text-xs text-gray-500">Ideas and reminders</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp" className="hover:bg-warm-beige/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp Message</p>
                      <p className="text-xs text-gray-500">Chat conversations</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="email" className="hover:bg-warm-beige/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-gray-500">Email content</p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-rich-mauve">{getSourceDescription(source)}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-deep-plum font-semibold">Content</Label>
              <Badge 
                className={`${getSourceColor(source)} shadow-sm`}
              >
                {getSourceIcon(source)}
                <span className="ml-1 capitalize">{source}</span>
              </Badge>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter your ${source} content here...`}
              rows={6}
              required
              className="border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20 resize-none"
            />
            <div className="flex items-center justify-between text-xs text-rich-mauve">
              <span>Tip: Be specific to get better AI suggestions</span>
              <span>{content.length}/1000</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">AI Enhancement</span>
            </div>
            <p className="text-xs text-blue-800">
              This context will be used to provide smarter task suggestions, better priority scoring, 
              and more accurate deadline predictions.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full h-12 bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Context Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}