import { apiClient } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { 
  Product, 
  ProductsResponse, 
  ProductResponse,
  CreateProductRequest, 
  UpdateProductRequest,
  ProductFilters,
  CategoriesResponse,
  Category
} from '../types/product';

export const productService = {
  // Get all categories as name-value pairs for dropdowns
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<CategoriesResponse>(
      API_ENDPOINTS.PRODUCTS_CATEGORIES
    );
    // Extract just the category names from the response
    return response.data.data.map(category => category.name);
  },

  // Get full category objects with IDs (needed for product creation)
  getCategoriesWithDetails: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoriesResponse>(
      API_ENDPOINTS.PRODUCTS_CATEGORIES
    );
    return response.data.data;
  },

  // Get all products
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.unlocked_only) {
      params.append('unlocked_only', 'true');
    }

    const response = await apiClient.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS_LIST}?${params.toString()}`
    );
    return response.data;
  },

  // Get unlocked products only
  getUnlockedProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.category) {
      params.append('category', filters.category);
    }

    const response = await apiClient.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS_UNLOCKED}?${params.toString()}`
    );
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: string, 
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.unlocked_only) {
      params.append('unlocked_only', 'true');
    }

    const response = await apiClient.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}/${encodeURIComponent(category)}?${params.toString()}`
    );
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(
      API_ENDPOINTS.PRODUCTS_BY_ID(id)
    );
    return response.data.data;
  },

  // Create new product (admin only)
  createProduct: async (productData: CreateProductRequest): Promise<Product> => {
    const formData = new FormData();
    
    formData.append('title', productData.title);
    formData.append('price', productData.price.toString());
    formData.append('category_id', productData.category_id.toString());
    
    if (productData.description) {
      formData.append('description', productData.description);
    }
    
    if (productData.short_description) {
      formData.append('short_description', productData.short_description);
    }
    
    if (productData.rating !== undefined) {
      formData.append('rating', productData.rating.toString());
    }
    
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<{ success: boolean; data: Product }>(
      API_ENDPOINTS.PRODUCTS_LIST,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Update product (admin only)
  updateProduct: async (productData: UpdateProductRequest): Promise<Product> => {
    const { id, ...updateData } = productData;
    const formData = new FormData();
    
    if (updateData.title) {
      formData.append('title', updateData.title);
    }
    if (updateData.price !== undefined) {
      formData.append('price', updateData.price.toString());
    }
    if (updateData.category_id) {
      formData.append('category_id', updateData.category_id.toString());
    }
    if (updateData.description) {
      formData.append('description', updateData.description);
    }
    if (updateData.short_description) {
      formData.append('short_description', updateData.short_description);
    }
    if (updateData.rating !== undefined) {
      formData.append('rating', updateData.rating.toString());
    }
    if (updateData.images && updateData.images.length > 0) {
      updateData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.put<{ success: boolean; data: Product }>(
      API_ENDPOINTS.PRODUCTS_BY_ID(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Lock product (admin only)
  lockProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<{ success: boolean; data: Product }>(
      API_ENDPOINTS.PRODUCTS_LOCK(id)
    );
    return response.data.data;
  },

  // Unlock product (admin only)
  unlockProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<{ success: boolean; data: Product }>(
      API_ENDPOINTS.PRODUCTS_UNLOCK(id)
    );
    return response.data.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS_BY_ID(id));
  },
};
