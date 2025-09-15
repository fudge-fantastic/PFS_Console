import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CategoriesTable } from '../../components/data-display/CategoriesTable';
import { CreateCategoryDialog } from '../../components/forms/CreateCategoryDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FolderOpen, Search, Filter, RefreshCw, Plus } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Categories refreshed');
  };

  const handleCategoryCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Category created successfully');
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
              <FolderOpen className="mr-3 h-6 w-6" />
              Category Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage product categories and organization
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Search and filter categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>
              All product categories in your system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CategoriesTable
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              refreshTrigger={refreshTrigger}
              onCategoryUpdated={() => setRefreshTrigger(prev => prev + 1)}
            />
          </CardContent>
        </Card>

        {/* Create Category Dialog */}
        <CreateCategoryDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCategoryCreated={handleCategoryCreated}
        />
      </div>
    </AdminLayout>
  );
}