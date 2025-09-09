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
  status: string;
  database?: string;
  upload_service?: string;
}

export interface WelcomeMessage {
  message: string;
  version: string;
  status: string;
  docs: string;
  redoc: string;
}
