import { apiClient } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { User, UsersResponse, UserFilters } from '../types/user';

export const userService = {
  // Get all users (admin only)
  getUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    
    if (filters.skip !== undefined) {
      params.append('skip', filters.skip.toString());
    }
    if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.role) {
      params.append('role', filters.role);
    }

    const response = await apiClient.get<UsersResponse>(
      `${API_ENDPOINTS.USERS_LIST}?${params.toString()}`
    );
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      API_ENDPOINTS.USERS_BY_ID(id)
    );
    return response.data.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      API_ENDPOINTS.USERS_ME
    );
    return response.data.data;
  },
};
