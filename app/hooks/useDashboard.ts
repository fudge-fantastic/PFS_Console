import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { productService } from '../services/product.service';
import { systemService } from '../services/system.service';
import { toast } from 'sonner';
import type { User } from '../types/user';
import type { Product } from '../types/product';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  activeProducts: number;
  lockedProducts: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  type: 'product' | 'user' | 'system';
  action: string;
  item: string;
  timestamp: string;
  time: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  isLoading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProducts: 0,
      totalUsers: 0,
      activeProducts: 0,
      lockedProducts: 0,
      systemHealth: 'healthy',
    },
    recentActivity: [],
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch data in parallel
      const [usersResponse, productsResponse, healthResponse] = await Promise.allSettled([
        userService.getUsers({ skip: 0, limit: 100 }),
        productService.getProducts({ skip: 0, limit: 100 }),
        systemService.getHealthStatus(),
      ]);

      // Process users data
      const users: User[] = usersResponse.status === 'fulfilled' ? usersResponse.value.data : [];
      const totalUsers = usersResponse.status === 'fulfilled' ? usersResponse.value.total || 0 : 0;

      // Process products data
      const products: Product[] = productsResponse.status === 'fulfilled' ? productsResponse.value.data : [];
      const totalProducts = productsResponse.status === 'fulfilled' ? productsResponse.value.total || 0 : 0;
      const activeProducts = products.filter((p: Product) => !p.locked).length;
      const lockedProducts = products.filter((p: Product) => p.locked).length;

      // Process system health
      const systemHealth = healthResponse.status === 'fulfilled' 
        ? (healthResponse.value.status === 'healthy' ? 'healthy' : 'warning')
        : 'error';

      // Generate recent activity from users and products
      const recentActivity: RecentActivity[] = [];

      // Add recent products
      const recentProducts = products
        .filter((p: Product) => p.created_at)
        .sort((a: Product, b: Product) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 3)
        .map((product: Product) => ({
          id: `product-${product.id}`,
          type: 'product' as const,
          action: product.locked ? 'Product locked' : 'Product created',
          item: product.title,
          timestamp: product.created_at!,
          time: formatTimeAgo(product.created_at!),
        }));

      // Add recent users
      const recentUsers = users
        .filter((u: User) => u.created_at)
        .sort((a: User, b: User) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 2)
        .map((user: User) => ({
          id: `user-${user.id}`,
          type: 'user' as const,
          action: 'New user registered',
          item: user.email,
          timestamp: user.created_at!,
          time: formatTimeAgo(user.created_at!),
        }));

      // Combine and sort by timestamp
      recentActivity.push(...recentProducts, ...recentUsers);
      recentActivity.sort((a: RecentActivity, b: RecentActivity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setData({
        stats: {
          totalProducts,
          totalUsers,
          activeProducts,
          lockedProducts,
          systemHealth,
        },
        recentActivity: recentActivity.slice(0, 5),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    ...data,
    refetch,
  };
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Less than an hour ago';
  } else if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return '1 day ago';
    } else {
      return `${diffInDays} days ago`;
    }
  }
}
