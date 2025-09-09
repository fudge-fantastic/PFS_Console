import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { toast } from 'sonner';
import type { Product, ProductFilters } from '../types/product';

interface UseProductsOptions {
  searchTerm?: string;
  categoryFilter?: string;
  statusFilter?: 'all' | 'active' | 'locked';
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  refetch: () => void;
  goToPage: (page: number) => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  const fetchProducts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: ProductFilters = {
        skip: (page - 1) * limit,
        limit,
      };

      // Add category filter to API call
      if (options.categoryFilter && options.categoryFilter !== 'all') {
        filters.category = options.categoryFilter;
      }

      // For status filter, we need to handle it differently:
      // - 'active' means unlocked products only
      // - 'locked' means we need all products then filter client-side
      // - 'all' means all products
      if (options.statusFilter === 'active') {
        filters.unlocked_only = true;
      }

      const response = await productService.getProducts(filters);
      let filteredProducts = response.data ?? [];

      // Apply client-side search filter
      if (options.searchTerm?.trim()) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.short_description && product.short_description.toLowerCase().includes(searchLower)) ||
          product.category_name.toLowerCase().includes(searchLower)
        );
      }

      // Apply client-side status filter for locked products
      // (active filter is already handled by API)
      if (options.statusFilter === 'locked') {
        filteredProducts = filteredProducts.filter(p => !!p.is_locked);
      }

      setProducts(filteredProducts);
      // For filtered results, we should update the total to reflect the actual filtered count
      // But for pagination, we need to be careful about the real total from the API
      const filteredTotal = (options.searchTerm?.trim() || options.statusFilter === 'locked') 
        ? filteredProducts.length 
        : (response.total || filteredProducts.length);
      setTotal(filteredTotal);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    fetchProducts(1);
  }, [options.searchTerm, options.categoryFilter, options.statusFilter]);

  const refetch = () => {
    fetchProducts(currentPage);
  };

  const goToPage = (page: number) => {
    fetchProducts(page);
  };

  return {
    products,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    refetch,
    goToPage,
  };
};
