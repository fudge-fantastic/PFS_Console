import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { toast } from 'sonner';
import type { Product, ProductFilters } from '../types/product';

interface UseProductsOptions {
  searchTerm?: string;
  categoryFilter?: string;
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

      // Add category filter
      if (options.categoryFilter && options.categoryFilter !== 'all') {
        filters.category = options.categoryFilter;
      }

      const response = await productService.getProducts(filters);
      let filteredProducts = response.data;

      // Apply client-side search filter
      if (options.searchTerm?.trim()) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(searchLower)
        );
      }

      setProducts(filteredProducts);
      setTotal(response.total || 0);
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
    fetchProducts(1);
  }, [options.searchTerm, options.categoryFilter]);

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
