"use client";

import { useRef } from 'react';
import { Task, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash2, CheckCircle2, Circle, PlayCircle, Target, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleHoverOut = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

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

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
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

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group cursor-pointer bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-all duration-300",
        task.status === 'completed' && "opacity-75",
        isOverdue && "border-red-300 bg-red-50/50"
      )}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {getStatusIcon(task.status)}
            <div className="min-w-0 flex-1">
              <CardTitle className={cn(
                "text-base lg:text-lg font-semibold text-deep-plum",
                task.status === 'completed' && "line-through text-gray-500"
              )}>
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="mt-1 text-sm text-rich-mauve line-clamp-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={cn("text-xs shadow-sm", getPriorityColor(task.priority_score))}>
              <Target className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">{getPriorityLabel(task.priority_score)}</span>
              <span className="sm:hidden">{task.priority_score}</span>
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {task.category && (
            <Badge variant="outline" className="text-xs border-rich-mauve text-rich-mauve bg-white/50">
              <Tag className="h-3 w-3 mr-1" />
              {task.category.name}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={cn("text-xs", getStatusColor(task.status))}
          >
            {task.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {task.deadline && (
            <div className={cn(
              "flex items-center gap-1",
              isOverdue ? "text-red-600 font-medium" : "text-rich-mauve"
            )}>
              <Calendar className="h-3 w-3" />
              <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
              {isOverdue && <span className="text-red-600 font-bold">OVERDUE</span>}
            </div>
          )}
          <div className="flex items-center gap-1 text-rich-mauve">
            <Clock className="h-3 w-3" />
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-warm-beige">
          {task.status !== 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1 h-9 text-xs border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Complete</span>
              <span className="sm:hidden">Done</span>
            </Button>
          )}
          {task.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, 'in_progress')}
              className="flex-1 h-9 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <PlayCircle className="h-3 w-3 mr-1" />
              Start
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, 'pending')}
              className="flex-1 h-9 text-xs border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Circle className="h-3 w-3 mr-1" />
              Reopen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}