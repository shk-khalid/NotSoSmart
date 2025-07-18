"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Task, Category, FilterOptions, TaskStatus } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { FilterBar } from '@/components/FilterBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, CheckSquare, Clock, AlertCircle } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[50vh]">
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your tasks..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md mx-4 bg-white/80 border-warm-beige">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-plum">Task Dashboard</h1>
          <p className="text-rich-mauve mt-1 text-sm sm:text-base">Manage your tasks with AI-powered insights</p>
        </div>
        <Link href="/tasks/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-cream-blush">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-white/80 border-warm-beige">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-rich-mauve">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-deep-plum">{taskCounts.total}</p>
              </div>
              <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-rich-mauve" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-warm-beige">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-rich-mauve">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-soft-mauve">{taskCounts.in_progress}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-soft-mauve" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-warm-beige">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-rich-mauve">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{taskCounts.completed}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-warm-beige">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-rich-mauve">Overdue</p>
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-deep-plum">
            {filters.status === 'all' ? 'All Tasks' : `${filters.status.replace('_', ' ')} Tasks`}
          </h2>
          <Badge variant="outline" className="self-start sm:self-auto border-soft-mauve text-rich-mauve">
            {filteredTasks.length} of {tasks.length} tasks
          </Badge>
        </div>

        {filteredTasks.length === 0 ? (
          <Card className="bg-white/80 border-warm-beige">
            <CardContent className="py-8 sm:py-12 text-center">
              <CheckSquare className="h-12 w-12 text-rich-mauve mx-auto mb-4" />
              <p className="text-rich-mauve text-lg">No tasks found</p>
              <p className="text-rich-mauve mt-2 text-sm sm:text-base">
                {tasks.length === 0 
                  ? "Create your first task to get started!" 
                  : "Try adjusting your filters or create a new task."
                }
              </p>
              <Link href="/tasks/create">
                <Button className="mt-4 bg-rich-mauve hover:bg-deep-plum text-cream-blush">
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