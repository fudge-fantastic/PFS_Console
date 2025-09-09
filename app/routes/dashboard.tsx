import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Activity,
  AlertCircle,
  RefreshCw,
  Lock
} from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { stats, recentActivity, isLoading, error, refetch } = useDashboard();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Dashboard stats configuration
  const statsConfig = [
    {
      name: 'Total Products',
      value: stats.totalProducts.toString(),
      change: `${stats.lockedProducts} locked`,
      changeType: stats.lockedProducts > 0 ? 'warning' : 'neutral',
      icon: Package,
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '+0 this week',
      changeType: 'neutral',
      icon: Users,
    },
    {
      name: 'Active Products',
      value: stats.activeProducts.toString(),
      change: `${((stats.activeProducts / stats.totalProducts) * 100 || 0).toFixed(0)}% of total`,
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'System Status',
      value: stats.systemHealth === 'healthy' ? 'Healthy' : stats.systemHealth === 'warning' ? 'Warning' : 'Error',
      change: stats.systemHealth === 'healthy' ? 'All systems operational' : 'Issues detected',
      changeType: stats.systemHealth,
      icon: Activity,
    },
  ] as const;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.email}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening with your PixelForge Studio today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button onClick={refetch} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : (
            statsConfig.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.name}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.name}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'warning' ? 'text-yellow-600' :
                      stat.changeType === 'error' ? 'text-red-600' :
                      'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-32"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === 'product' ? (
                            activity.action.includes('locked') ? (
                              <Lock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <Package className="h-4 w-4 text-primary" />
                            )
                          ) : activity.type === 'user' ? (
                            <Users className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {activity.item}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <a href="/products/create">
                  <Package className="mr-2 h-4 w-4" />
                  Create New Product
                </a>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <a href="/products">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All Products
                </a>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <a href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </a>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <a href="/system/health">
                  <Activity className="mr-2 h-4 w-4" />
                  System Health
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
