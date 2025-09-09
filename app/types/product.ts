export interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  total: number;
}

export interface Product {
  id: number;
  title: string;
  description?: string;
  short_description?: string;
  price: number;
  category_id: number; // Category ID for API calls
  category_name: string; // Category name for display
  rating?: number;
  images?: string[];
  is_locked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  short_description?: string;
  price: number;
  category_id: number; // Backend expects category_id, not category name
  rating?: number;
  images?: File[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

export interface ProductFilters {
  category?: string;
  skip?: number;
  limit?: number;
  unlocked_only?: boolean;
}
