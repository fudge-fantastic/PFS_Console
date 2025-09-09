export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  TOKEN: '/auth/token',
  
  // Users
  USERS_ME: '/users/me',
  USERS_LIST: '/users/',
  USERS_BY_ID: (id: number) => `/users/${id}`,
  
  // Products
  PRODUCTS_LIST: '/products/',
  PRODUCTS_UNLOCKED: '/products/unlocked',
  PRODUCTS_BY_CATEGORY: '/products/category',
  PRODUCTS_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_LOCK: (id: number) => `/products/${id}/lock`,
  PRODUCTS_UNLOCK: (id: number) => `/products/${id}/unlock`,
  PRODUCTS_CATEGORIES: '/categories', // New endpoint for dynamic categories
  
  // Inquiry System
  INQUIRY_CONTACT: '/inquiry/contact',
  INQUIRY_TEST: '/inquiry/contact/test',
  
  // System
  WELCOME: '/',
  HEALTH: '/health',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'PixelForge Studio Admin',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
} as const;
