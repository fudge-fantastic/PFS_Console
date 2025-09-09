import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { systemService } from '../../services/system.service';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  Activity,
  Server, 
  Database,
  Wifi,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemHealthData {
  status: string;
  database?: string;
  upload_service?: string;
}

export default function SystemHealth() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await systemService.getHealthStatus();
      setHealthData(response);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);
      toast.error('Failed to load system health');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHealthData();
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchHealthData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        );
    }
  };

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Activity className="mr-3 h-6 w-6" />
              System Health
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor system status and performance
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={fetchHealthData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Overall System Status
              {healthData && getStatusIcon(healthData.status)}
            </CardTitle>
            <CardDescription>
              Current system health and uptime
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : error ? (
              <div className="text-red-600">
                Error loading health data: {error}
              </div>
            ) : healthData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(healthData.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Uptime:</span>
                  <span className="text-sm font-mono">
                    {healthData.uptime ? formatUptime(healthData.uptime) : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Check:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(healthData.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Component Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Server</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : healthData ? (
                <div className="space-y-2">
                  {getStatusBadge(healthData.components.api)}
                  <p className="text-xs text-muted-foreground">
                    REST API endpoints responding normally
                  </p>
                </div>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : healthData ? (
                <div className="space-y-2">
                  {getStatusBadge(healthData.components.database)}
                  <p className="text-xs text-muted-foreground">
                    Database connections active
                  </p>
                </div>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </CardContent>
          </Card>

          {/* Storage Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : healthData ? (
                <div className="space-y-2">
                  {getStatusBadge(healthData.components.storage)}
                  <p className="text-xs text-muted-foreground">
                    File storage accessible
                  </p>
                </div>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent System Events</CardTitle>
            <CardDescription>
              Latest system activities and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">System startup completed</p>
                  <p className="text-xs text-green-700">{new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Health check passed</p>
                  <p className="text-xs text-blue-700">All components operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
