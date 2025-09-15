export interface Category {
  id: string; // MongoDB ObjectId as string
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
  is_active?: boolean;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  total: number;
  message: string;
}

export interface CategoryFilters {
  skip?: number;
  limit?: number;
  active_only?: boolean;
}

export interface DeleteCategoryResponse {
  success: boolean;
  data: {
    id: string;
    deleted: boolean;
  };
  message: string;
}