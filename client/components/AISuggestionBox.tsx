"use client";

import { AISuggestionResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, X, Calendar, Tag, Target } from 'lucide-react';
import { format } from 'date-fns';

interface AISuggestionBoxProps {
  suggestions: AISuggestionResponse;
  onAccept: () => void;
  onReject: () => void;
}

export function AISuggestionBox({ suggestions, onAccept, onReject }: AISuggestionBoxProps) {
  const getPriorityColor = (score: number) => {
    if (score >= 7) return 'bg-red-500 text-white';
    if (score >= 4) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Sparkles className="h-5 w-5" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.enhanced_description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-blue-900">Enhanced Description</span>
            </div>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
              {suggestions.enhanced_description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.suggested_deadline && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Suggested Deadline</span>
              </div>
              <p className="text-sm text-gray-700">
                {format(new Date(suggestions.suggested_deadline), "MMM d, yyyy")}
              </p>
            </div>
          )}

          {suggestions.suggested_category && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Suggested Category</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {suggestions.suggested_category}
              </Badge>
            </div>
          )}

          {suggestions.priority_score && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Priority Score</span>
              </div>
              <Badge className={getPriorityColor(suggestions.priority_score)}>
                {suggestions.priority_score} - {getPriorityLabel(suggestions.priority_score)}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={onAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept Suggestions
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}