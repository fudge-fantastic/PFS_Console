export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  success: false;
  message: string;
  details?: any;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime?: number;
}

export interface WelcomeMessage {
  message: string;
  version?: string;
  timestamp?: string;
}
