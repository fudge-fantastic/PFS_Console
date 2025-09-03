import { apiClient } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { SystemHealth, WelcomeMessage } from '../types/api';

export const systemService = {
  // Get welcome message
  getWelcomeMessage: async (): Promise<WelcomeMessage> => {
    const response = await apiClient.get<WelcomeMessage>(API_ENDPOINTS.WELCOME);
    return response.data;
  },

  // Get system health status
  getHealthStatus: async (): Promise<SystemHealth> => {
    const response = await apiClient.get<SystemHealth>(API_ENDPOINTS.HEALTH);
    return response.data;
  },
};
