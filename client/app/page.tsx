"use client";

import { useState, useEffect, useRef } from 'react';
import { Task, Category, FilterOptions, TaskStatus } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { FilterBar } from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { mockTasks, mockCategories } from '@/utils/api';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    priority: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        // Simulate API loading
        await new Promise(resolve => setTimeout(resolve, 500));
        setTasks(mockTasks);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!loading && headerRef.current && statsRef.current && tasksRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(statsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(tasksRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, [loading]);

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.category !== 'all' && task.category?.id !== filters.category) return false;
    if (filters.priority !== 'all') {
      const priority = task.priority_score >= 7 ? 'high' : task.priority_score >= 4 ? 'medium' : 'low';
      if (priority !== filters.priority) return false;
    }
    return true;
  });

  // Calculate task counts
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  // Calculate overdue tasks
  const overdueTasks = tasks.filter(task => 
    task.deadline && 
    new Date(task.deadline) < new Date() && 
    task.status !== 'completed'
  ).length;

  const handleTaskEdit = (task: Task) => {
    // Navigate to edit page
    window.location.href = `/tasks/edit/${task.id}`;
  };

  const handleTaskDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setTasks(prev => prev.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tasks</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your tasks with AI-powered insights</p>
        </div>
        <Link href="/tasks/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{taskCounts.total}</p>
              </div>
              <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{taskCounts.in_progress}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{taskCounts.completed}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        taskCounts={taskCounts}
      />

      {/* Tasks Grid */}
      <div ref={tasksRef} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {filters.status === 'all' ? 'All Tasks' : `${filters.status.replace('_', ' ')} Tasks`}
          </h2>
          <Badge variant="outline" className="self-start sm:self-auto">
            {filteredTasks.length} of {tasks.length} tasks
          </Badge>
        </div>

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                {tasks.length === 0 
                  ? "Create your first task to get started!" 
                  : "Try adjusting your filters or create a new task."
                }
              </p>
              <Link href="/tasks/create">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleTaskEdit}
                onDelete={handleTaskDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}