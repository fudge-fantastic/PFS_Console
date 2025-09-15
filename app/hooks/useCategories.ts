import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import { toast } from 'sonner';
import type { Category, CategoryFilters } from '../types/category';

interface UseCategoriesOptions {
  searchTerm?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
  refreshTrigger?: number;
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  refetch: () => void;
  goToPage: (page: number) => void;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: CategoryFilters = {
        skip: (currentPage - 1) * limit,
        limit: limit,
      };

      // Apply status filter
      if (options.statusFilter === 'active') {
        filters.active_only = true;
      }

      const response = await categoryService.getCategories(filters);
      let filteredCategories = response.data;

      // Apply search filter on client-side
      if (options.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredCategories = filteredCategories.filter(category =>
          category.name.toLowerCase().includes(searchLower) ||
          (category.description && category.description.toLowerCase().includes(searchLower))
        );
      }

      // Apply inactive filter on client-side
      if (options.statusFilter === 'inactive') {
        filteredCategories = filteredCategories.filter(category => !category.is_active);
      }

      setCategories(filteredCategories);
      setTotal(response.total || filteredCategories.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, options.searchTerm, options.statusFilter, options.refreshTrigger]);

  const refetch = () => {
    fetchCategories();
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    categories,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    refetch,
    goToPage,
  };
};