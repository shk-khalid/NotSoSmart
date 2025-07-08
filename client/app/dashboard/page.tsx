"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Task, Category, FilterOptions, TaskStatus } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { FilterBar } from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, CheckSquare, Clock, AlertCircle, Target, Calendar, Sparkles } from 'lucide-react';
import todoService from '@/services/todo-service';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    priority: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load data from backend
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Load tasks and categories in parallel
        const [tasksData, categoriesData] = await Promise.all([
          todoService.getTasks(),
          todoService.getCategories()
        ]);
        
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error loading data:', error);
        setError(error.message || 'Failed to load data. Please try again.');
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Don't render if not authenticated
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-mauve mx-auto mb-4"></div>
          <p className="text-deep-plum">Loading...</p>
        </div>
      </div>
    );
  }

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

  // Calculate high priority tasks
  const highPriorityTasks = tasks.filter(task => 
    task.priority_score >= 7 && task.status !== 'completed'
  ).length;

  // Calculate completion rate
  const completionRate = tasks.length > 0 ? Math.round((taskCounts.completed / tasks.length) * 100) : 0;

  const handleTaskEdit = (task: Task) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const handleTaskDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await todoService.deleteTask(id);
        setTasks(prev => prev.filter(task => task.id !== id));
        toast.success('Task deleted successfully');
      } catch (error: any) {
        console.error('Error deleting task:', error);
        toast.error(error.message || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      const updatedTask = await todoService.updateTask(id, { status });
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      toast.success(`Task marked as ${status.replace('_', ' ')}`);
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.error(error.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-mauve mx-auto mb-4"></div>
          <p className="text-deep-plum">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 border-warm-beige shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-deep-plum mb-2">Error Loading Tasks</h3>
              <p className="text-rich-mauve mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-rich-mauve hover:bg-deep-plum text-cream-blush"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-deep-plum">Task Dashboard</h1>
            <p className="text-rich-mauve mt-2 text-base lg:text-lg">Manage your tasks with AI-powered insights</p>
          </div>
          <Link href="/tasks/create" className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-cream-blush shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Total Tasks</p>
                  <p className="text-2xl lg:text-3xl font-bold text-deep-plum">{taskCounts.total}</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">In Progress</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600">{taskCounts.in_progress}</p>
                </div>
                <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Completed</p>
                  <p className="text-2xl lg:text-3xl font-bold text-green-600">{taskCounts.completed}</p>
                </div>
                <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">Overdue</p>
                  <p className="text-2xl lg:text-3xl font-bold text-red-600">{overdueTasks}</p>
                </div>
                <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rich-mauve font-medium">High Priority</p>
                  <p className="text-2xl lg:text-3xl font-bold text-orange-600">{highPriorityTasks}</p>
                </div>
                <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
            <CardTitle className="flex items-center gap-2 text-deep-plum">
              <Sparkles className="h-5 w-5" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-rich-mauve">Completion Rate</span>
                  <span className="text-sm font-bold text-deep-plum">{completionRate}%</span>
                </div>
                <div className="w-full bg-warm-beige rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rich-mauve to-deep-plum h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-rich-mauve">Active Tasks</span>
                  <span className="text-sm font-bold text-deep-plum">{taskCounts.pending + taskCounts.in_progress}</span>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2"></div>
                  <div className="flex-1 bg-blue-500 rounded-full h-2"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-rich-mauve">Categories</span>
                  <span className="text-sm font-bold text-deep-plum">{categories.length}</span>
                </div>
                <div className="flex gap-1">
                  {categories.slice(0, 5).map((_, index) => (
                    <div key={index} className="flex-1 bg-rich-mauve rounded-full h-2"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          taskCounts={taskCounts}
        />

        {/* Tasks Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl lg:text-2xl font-semibold text-deep-plum">
              {filters.status === 'all' ? 'All Tasks' : `${filters.status.replace('_', ' ')} Tasks`}
            </h2>
            <Badge variant="outline" className="self-start sm:self-auto border-soft-mauve text-rich-mauve bg-white/50">
              {filteredTasks.length} of {tasks.length} tasks
            </Badge>
          </div>

          {filteredTasks.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-warm-beige shadow-lg">
              <CardContent className="py-12 lg:py-16 text-center">
                <CheckSquare className="h-16 w-16 text-rich-mauve mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-deep-plum mb-2">No tasks found</h3>
                <p className="text-rich-mauve mb-6 max-w-md mx-auto">
                  {tasks.length === 0 
                    ? "Create your first task to get started with AI-powered productivity!" 
                    : "Try adjusting your filters or create a new task."
                  }
                </p>
                <Link href="/tasks/create">
                  <Button className="bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-cream-blush shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
}