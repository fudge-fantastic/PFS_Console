import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  email: string;
  role?: string;
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Token management
export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  set: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  
  remove: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  isValid: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  decode: (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  },
};

// User storage
export const userStorage = {
  get: (): AuthUser | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  set: (user: AuthUser): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  remove: (): void => {
    localStorage.removeItem('user');
  },
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.get();
  return token ? tokenStorage.isValid(token) : false;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = userStorage.get();
  return user?.role === 'admin';
};

// Get current user from token
export const getCurrentUser = (): AuthUser | null => {
  const token = tokenStorage.get();
  if (!token || !tokenStorage.isValid(token)) {
    return null;
  }
  
  const decoded = tokenStorage.decode(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    email: decoded.email,
    role: (decoded.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
  };
};
