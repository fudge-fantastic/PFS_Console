export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Users
  USERS_ME: '/users/me',
  USERS_LIST: '/users/',
  
  // Products
  PRODUCTS_LIST: '/products/',
  PRODUCTS_UNLOCKED: '/products/unlocked',
  PRODUCTS_BY_CATEGORY: '/products/category',
  PRODUCTS_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_LOCK: (id: number) => `/products/${id}/lock`,
  PRODUCTS_UNLOCK: (id: number) => `/products/${id}/unlock`,
  
  // System
  WELCOME: '/',
  HEALTH: '/health',
} as const;

export const PRODUCT_CATEGORIES = [
  'Photo Magnets',
  'Fridge Magnets',
  'Retro Prints',
] as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'PixelForge Studio Admin',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 10,
} as const;
