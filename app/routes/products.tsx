import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProductsTable } from '../components/data-display/ProductsTable';
import { CreateProductDialog } from '../components/forms/CreateProductDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package, Search, Filter, RefreshCw, Plus } from 'lucide-react';
import { productService } from '../services/product.service';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Use the products hook with filters
  const { refetch: refetchProducts } = useProducts({
    searchTerm,
    categoryFilter,
    statusFilter,
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const fetchedCategories = await productService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleRefresh = () => {
    fetchCategories();
    refetchProducts();
    toast.success('Products and categories refreshed');
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
              <Package className="mr-3 h-6 w-6" />
              Product Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Search and filter products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full sm:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger disabled={isLoadingCategories}>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Filter by category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'locked') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="locked">Locked Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Products</CardTitle>
            <CardDescription>
              All products in your catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ProductsTable
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              categories={categories}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
            />
          </CardContent>
        </Card>

        {/* Create Product Dialog */}
        <CreateProductDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onProductCreated={() => {
            refetchProducts();
            fetchCategories();
            toast.success('Product created successfully');
          }}
        />
      </div>
    </AdminLayout>
  );
}
