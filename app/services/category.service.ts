import { apiClient } from '../lib/api';
import type {
  Category,
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilters,
  DeleteCategoryResponse
} from '../types/category';

const CATEGORY_ENDPOINTS = {
  LIST: '/categories/',
  ACTIVE: '/categories/active',
  BY_ID: (id: string) => `/categories/${id}`,
} as const;

export const categoryService = {
  // Get all categories
  getCategories: async (filters: CategoryFilters = {}): Promise<CategoriesResponse> => {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.active_only) {
      params.append('active_only', 'true');
    }

    const response = await apiClient.get<CategoriesResponse>(
      `${CATEGORY_ENDPOINTS.LIST}?${params.toString()}`
    );
    return response.data;
  },

  // Get active categories only
  getActiveCategories: async (filters: CategoryFilters = {}): Promise<CategoriesResponse> => {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }

    const response = await apiClient.get<CategoriesResponse>(
      `${CATEGORY_ENDPOINTS.ACTIVE}?${params.toString()}`
    );
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<CategoryResponse>(
      CATEGORY_ENDPOINTS.BY_ID(id)
    );
    return response.data.data;
  },

  // Create new category (admin only)
  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<CategoryResponse>(
      CATEGORY_ENDPOINTS.LIST,
      categoryData
    );
    return response.data.data;
  },

  // Update category (admin only)
  updateCategory: async (categoryData: UpdateCategoryRequest): Promise<Category> => {
    const { id, ...updateData } = categoryData;

    const response = await apiClient.put<CategoryResponse>(
      CATEGORY_ENDPOINTS.BY_ID(id),
      updateData
    );
    return response.data.data;
  },

  // Delete category (admin only)
  // Performs soft delete by default (sets is_active to false)
  deleteCategory: async (id: string, hardDelete: boolean = false): Promise<DeleteCategoryResponse> => {
    const params = new URLSearchParams();
    if (hardDelete) {
      params.append('hard_delete', 'true');
    }

    const response = await apiClient.delete<DeleteCategoryResponse>(
      `${CATEGORY_ENDPOINTS.BY_ID(id)}?${params.toString()}`
    );
    return response.data;
  },

  // Activate category (admin only) - convenience method for updating is_active to true
  activateCategory: async (id: string): Promise<Category> => {
    return categoryService.updateCategory({
      id,
      is_active: true
    });
  },

  // Deactivate category (admin only) - convenience method for updating is_active to false
  deactivateCategory: async (id: string): Promise<Category> => {
    return categoryService.updateCategory({
      id,
      is_active: false
    });
  },
};