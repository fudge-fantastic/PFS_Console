import { apiClient } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AuthUser } from '../types/auth';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.REGISTER,
      userData
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<{ success: boolean; data: AuthUser }>(
      API_ENDPOINTS.USERS_ME
    );
    return response.data.data;
  },

  // Logout (client-side only)
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
