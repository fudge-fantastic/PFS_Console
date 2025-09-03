export interface Product {
  id: number;
  title: string;
  price: number;
  category: 'Photo Magnets' | 'Fridge Magnets' | 'Retro Prints';
  rating?: number;
  images?: string[];
  locked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  title: string;
  price: number;
  category: string;
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
