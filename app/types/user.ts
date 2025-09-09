export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at?: string;
  updated_at?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

export interface UserFilters {
  skip?: number;
  limit?: number;
  role?: string;
}
