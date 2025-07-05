"use client";

import { useRef, useEffect } from 'react';
import { Task, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash2, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
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

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -5,
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
        "group cursor-pointer",
        task.status === 'completed' && "opacity-75",
        isOverdue && "border-red-300 bg-red-50"
      )}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getStatusIcon(task.status)}
            <CardTitle className={cn(
              "text-base sm:text-lg font-semibold truncate",
              task.status === 'completed' && "line-through text-gray-500"
            )}>
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge className={cn("text-xs", getPriorityColor(task.priority_score))}>
              <span className="hidden sm:inline">{getPriorityLabel(task.priority_score)}</span>
              <span className="sm:hidden">{task.priority_score}</span>
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-100"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        {task.description && (
          <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {task.category && (
            <Badge variant="outline" className="text-xs">
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
              isOverdue ? "text-red-600" : "text-gray-500"
            )}>
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {task.status !== 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1 h-8 text-xs"
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
              className="flex-1 h-8 text-xs"
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
              className="flex-1 h-8 text-xs"
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