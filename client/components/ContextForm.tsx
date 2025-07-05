"use client";

import { useState } from 'react';
import { ContextSource } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Mail, StickyNote } from 'lucide-react';

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
        return 'bg-green-500';
      case 'email':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Context Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source Type</Label>
            <Select value={source} onValueChange={(value) => setSource(value as ContextSource)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Personal Note
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Message
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <Badge 
                variant="outline" 
                className={`text-white ${getSourceColor(source)}`}
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
              rows={4}
              required
              className="min-h-24"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add Context Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}