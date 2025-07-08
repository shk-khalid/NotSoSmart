"use client";

import { useState, useEffect } from 'react';
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
import { CalendarIcon, Save, Sparkles, Loader2, Target, Clock, Tag, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const category = formData.category ? categories.find(c => c.id === formData.category) || null : null;
    
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category,
      priority_score: formData.priority_score,
      deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : null,
      status: formData.status,
    });
  };

  const handleAIEnhance = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: 'Please enter a task title first' });
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-xl">
          <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-deep-plum">
                    {task ? 'Edit Task' : 'Create New Task'}
                  </CardTitle>
                  <p className="text-sm text-rich-mauve mt-1">
                    {task ? 'Update your task details' : 'Add a new task with AI-powered enhancement'}
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="self-start sm:ml-auto border-rich-mauve text-rich-mauve bg-white/50"
              >
                {task ? `ID: ${task.id}` : 'New Task'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Field */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-deep-plum font-semibold text-base flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full" />
                  Task Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="Enter a clear, descriptive task title..."
                  className={cn(
                    "h-12 text-base border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20 transition-all",
                    errors.title && "border-red-300 focus:border-red-500"
                  )}
                  required
                />
                {errors.title && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{errors.title}</p>
                  </div>
                )}
              </div>

              {/* Description Field with AI Enhancement */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Label htmlFor="description" className="text-deep-plum font-semibold text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIEnhance}
                    disabled={aiLoading || !formData.title.trim()}
                    className="flex items-center gap-2 self-start sm:self-auto border-2 border-rich-mauve text-rich-mauve hover:bg-rich-mauve hover:text-white transition-all shadow-sm"
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
                  placeholder="Describe your task in detail..."
                  rows={4}
                  className="border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20 resize-none transition-all"
                />
              </div>

              {/* Category and Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-deep-plum font-semibold text-base flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </Label>
                  <Select
                    value={formData.category?.toString() || 'null'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value === 'null' ? null : parseInt(value) }))}
                  >
                    <SelectTrigger className="h-12 border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20 transition-all">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-warm-beige shadow-lg">
                      <SelectItem value="null" className="hover:bg-warm-beige/50">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full" />
                          No Category
                        </div>
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()} className="hover:bg-warm-beige/50">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-rich-mauve rounded-full" />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-deep-plum font-semibold text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as TaskStatus }))}
                  >
                    <SelectTrigger className="h-12 border-2 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-warm-beige shadow-lg">
                      <SelectItem value="pending" className="hover:bg-warm-beige/50">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="in_progress" className="hover:bg-warm-beige/50">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="completed" className="hover:bg-warm-beige/50">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          Completed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority and Deadline Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-deep-plum font-semibold text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Priority Score
                  </Label>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.priority_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority_score: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-warm-beige rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #856287 0%, #856287 ${(formData.priority_score - 1) * 11.11}%, #d0b2b1 ${(formData.priority_score - 1) * 11.11}%, #d0b2b1 100%)`
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-rich-mauve font-medium">Low</span>
                      <Badge className={cn("text-white text-sm px-4 py-1 shadow-sm", getPriorityColor(formData.priority_score))}>
                        {formData.priority_score} - {getPriorityLabel(formData.priority_score)}
                      </Badge>
                      <span className="text-sm text-rich-mauve font-medium">High</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-deep-plum font-semibold text-base flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Deadline
                  </Label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-2 border-warm-beige hover:bg-warm-beige/50 transition-all",
                          !formData.deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-rich-mauve" />
                        {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-warm-beige shadow-lg">
                      <Calendar
                        mode="single"
                        selected={formData.deadline || undefined}
                        onSelect={(date) => {
                          setFormData(prev => ({ ...prev, deadline: date || null }));
                          setShowCalendar(false);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                      {formData.deadline && (
                        <div className="p-3 border-t border-warm-beige">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, deadline: null }));
                              setShowCalendar(false);
                            }}
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Clear Date
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* AI Suggestions Display */}
              {aiSuggestions && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Suggestions Applied
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {aiSuggestions.enhanced_description && (
                      <div className="flex items-center gap-2 text-blue-800">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        Enhanced description with more details
                      </div>
                    )}
                    {aiSuggestions.suggested_deadline && (
                      <div className="flex items-center gap-2 text-blue-800">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        Suggested deadline: {format(new Date(aiSuggestions.suggested_deadline), "PPP")}
                      </div>
                    )}
                    {aiSuggestions.suggested_category && (
                      <div className="flex items-center gap-2 text-blue-800">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        Suggested category: {aiSuggestions.suggested_category}
                      </div>
                    )}
                    {aiSuggestions.priority_score && (
                      <div className="flex items-center gap-2 text-blue-800">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        Updated priority score: {aiSuggestions.priority_score}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-warm-beige">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.title.trim()}
                  className="w-full sm:flex-1 h-12 bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {task ? 'Update Task' : 'Create Task'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full sm:flex-1 h-12 border-2 border-warm-beige text-rich-mauve hover:bg-warm-beige/50 transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}