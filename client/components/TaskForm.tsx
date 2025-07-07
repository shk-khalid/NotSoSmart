"use client";

import { useState, useEffect, useRef } from 'react';
import { Task, Category, TaskStatus, AISuggestionInput, AISuggestionResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Save, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { gsap } from 'gsap';
import todoService from '@/services/todo-service';

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSave: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  onAIEnhance: (data: AISuggestionInput) => void;
  isLoading?: boolean;
  aiSuggestions?: AISuggestionResponse | null;
}

export function TaskForm({
  task,
  categories,
  onSave,
  onCancel,
  onAIEnhance,
  isLoading = false,
  aiSuggestions
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category?.id || null as number | null,
    priority_score: task?.priority_score || 5,
    deadline: task?.deadline ? new Date(task.deadline) : null as Date | null,
    status: task?.status || 'pending' as TaskStatus,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        description: aiSuggestions.enhanced_description || prev.description,
        priority_score: aiSuggestions.priority_score || prev.priority_score,
        deadline: aiSuggestions.suggested_deadline ? new Date(aiSuggestions.suggested_deadline) : prev.deadline,
      }));
      
      // If suggested category exists, set it
      if (aiSuggestions.suggested_category) {
        const existingCategory = categories.find(c => c.name.toLowerCase() === aiSuggestions.suggested_category.toLowerCase());
        if (existingCategory) {
          setFormData(prev => ({
            ...prev,
            category: existingCategory.id,
          }));
        }
      }
    }
  }, [aiSuggestions, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = formData.category ? categories.find(c => c.id === formData.category) || null : null;
    
    onSave({
      title: formData.title,
      description: formData.description,
      category,
      priority_score: formData.priority_score,
      deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : null,
      status: formData.status,
    });
  };

  const handleAIEnhance = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title first');
      return;
    }

    setAiLoading(true);
    try {
      // Get context data for AI suggestions
      const contexts = await todoService.getContexts();
      const contextData = contexts.map(c => c.content);

      await onAIEnhance({
        title: formData.title,
        description: formData.description,
        category: formData.category ? categories.find(c => c.id === formData.category)?.name : undefined,
        context_data: contextData,
      });
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 7) return 'bg-red-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <Card ref={formRef} className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span>{task ? 'Edit Task' : 'Create New Task'}</span>
          <Badge variant="outline" className="self-start sm:ml-auto">
            {task ? `ID: ${task.id}` : 'New'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIEnhance}
                disabled={aiLoading || !formData.title.trim()}
                className="flex items-center gap-2 self-start sm:self-auto"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Enhance with AI</span>
                <span className="sm:hidden">AI Enhance</span>
              </Button>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your task..."
              rows={3}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category?.toString() || 'null'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value === 'null' ? null : parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as TaskStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority Score</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.priority_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority_score: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <Badge className={cn("text-white text-xs", getPriorityColor(formData.priority_score))}>
                  {formData.priority_score} - {getPriorityLabel(formData.priority_score)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline || undefined}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, deadline: date || null }));
                      setShowCalendar(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {aiSuggestions && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Suggestions Applied
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                {aiSuggestions.enhanced_description && (
                  <p>• Enhanced description with more details</p>
                )}
                {aiSuggestions.suggested_deadline && (
                  <p>• Suggested deadline: {format(new Date(aiSuggestions.suggested_deadline), "PPP")}</p>
                )}
                {aiSuggestions.suggested_category && (
                  <p>• Suggested category: {aiSuggestions.suggested_category}</p>
                )}
                {aiSuggestions.priority_score && (
                  <p>• Updated priority score: {aiSuggestions.priority_score}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="w-full sm:flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {task ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}