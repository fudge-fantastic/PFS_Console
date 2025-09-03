import React, { useState, useEffect, createContext, useContext } from 'react';
import type { AuthUser } from '../types/auth';
import { isAuthenticated, tokenStorage, userStorage } from '../lib/auth';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // Try to get user from storage first
        const storedUser = userStorage.get();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // If no stored user, try to refresh user data
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            userStorage.set(userData);
          } catch {
            // If refresh fails, clear auth
            tokenStorage.remove();
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { access_token, user: userData } = response.data;
      
      tokenStorage.set(access_token);
      userStorage.set(userData);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated()) return;
    
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      userStorage.set(userData);
    } catch {
      // If refresh fails, logout user
      logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
