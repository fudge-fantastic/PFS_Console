export interface AuthUser {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: AuthUser;
  };
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    user: AuthUser;
  };
  message?: string;
}
