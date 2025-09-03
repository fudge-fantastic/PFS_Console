import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { toast } from 'sonner';
import type { User, UserFilters } from '../types/user';

interface UseUsersOptions {
  searchTerm?: string;
  roleFilter?: string;
  statusFilter?: string;
}

interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  refetch: () => void;
  goToPage: (page: number) => void;
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchUsers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: UserFilters = {
        skip: (page - 1) * limit,
        limit,
      };

      // Add role filter
      if (options.roleFilter && options.roleFilter !== 'all') {
        filters.role = options.roleFilter;
      }

      const response = await userService.getUsers(filters);
      let filteredUsers = response.data;

      // Apply client-side search filter
      if (options.searchTerm?.trim()) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply client-side status filter (for demo purposes)
      if (options.statusFilter && options.statusFilter !== 'all') {
        // For demo, we'll simulate status based on email patterns
        filteredUsers = filteredUsers.filter(user => {
          const status = user.email.includes('admin') ? 'active' : 
                        user.email.includes('test') ? 'inactive' : 'active';
          return status === options.statusFilter;
        });
      }

      setUsers(filteredUsers);
      setTotal(response.total || 0);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [options.searchTerm, options.roleFilter]);

  const refetch = () => {
    fetchUsers(currentPage);
  };

  const goToPage = (page: number) => {
    fetchUsers(page);
  };

  return {
    users,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    refetch,
    goToPage,
  };
};
