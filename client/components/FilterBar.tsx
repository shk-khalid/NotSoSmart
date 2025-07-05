"use client";

import { FilterOptions, Category } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: Category[];
  taskCounts: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export function FilterBar({ filters, onFiltersChange, categories, taskCounts }: FilterBarProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value as any,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      priority: 'all',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.category !== 'all' || filters.priority !== 'all';

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs ml-auto"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-gray-500">Status</span>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({taskCounts.total})</SelectItem>
                  <SelectItem value="pending">Pending ({taskCounts.pending})</SelectItem>
                  <SelectItem value="in_progress">In Progress ({taskCounts.in_progress})</SelectItem>
                  <SelectItem value="completed">Completed ({taskCounts.completed})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">Category</span>
              <Select value={filters.category.toString()} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">Priority</span>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-xs text-gray-500">Active:</span>
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.status.replace('_', ' ')}
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.id === filters.category)?.name || 'Unknown'}
                </Badge>
              )}
              {filters.priority !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.priority} priority
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}