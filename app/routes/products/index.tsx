import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ProductsTable } from '../../components/data-display/ProductsTable';
import { CreateProductDialog } from '../../components/forms/CreateProductDialog';
import { productService } from '../../services/product.service';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [tableKey, setTableKey] = useState(0); // Key to force table refresh

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

  const handleCreateProduct = () => {
    console.log('Product created successfully');
    toast.success('Product created successfully');
    setShowCreateDialog(false);
    setTableKey(prev => prev + 1); // Force table refresh
    fetchCategories(); // Refresh categories after product creation
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Add Product button */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Package className="mr-3 h-7 w-7" />
              Products Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your product catalog, inventory, and product details.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Table with filters toolbar (shadcn Tasks style) */}
        <ProductsTable
          key={tableKey}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Create Product Dialog */}
        <CreateProductDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onProductCreated={handleCreateProduct}
        />
      </div>
    </AdminLayout>
  );
}
