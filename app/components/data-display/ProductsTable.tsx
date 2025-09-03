import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { MoreHorizontal, Eye, Edit, Lock, Unlock, Trash2, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DataTablePagination } from './DataTablePagination';
import { BulkActionsBar } from '../advanced/BulkActionsBar';
import { EditProductDialog } from '../forms/EditProductDialog';
import { useProducts } from '../../hooks/useProducts';
import { useNotifications } from '../../contexts/NotificationContext';
import type { Product } from '../../types/product';

interface ProductsTableProps {
  searchTerm?: string;
  categoryFilter?: string;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  searchTerm,
  categoryFilter,
}) => {
  const { products, isLoading, error, currentPage, totalPages, goToPage } = useProducts({
    searchTerm,
    categoryFilter,
  });
  
  const { success, warning, error: showError } = useNotifications();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Define bulk operations
  const bulkOperations = [
    {
      id: 'lock',
      label: 'Lock Products',
      icon: <Lock className="mr-2 h-4 w-4" />,
      action: async (selectedIds: string[]) => {
        const selectedProductObjects = products.filter(p => selectedIds.includes(p.id.toString()));
        console.log('Bulk locking:', selectedProductObjects);
        success(`Locked ${selectedIds.length} products`);
        setSelectedProducts([]);
      },
    },
    {
      id: 'unlock',
      label: 'Unlock Products',
      icon: <Unlock className="mr-2 h-4 w-4" />,
      action: async (selectedIds: string[]) => {
        const selectedProductObjects = products.filter(p => selectedIds.includes(p.id.toString()));
        console.log('Bulk unlocking:', selectedProductObjects);
        success(`Unlocked ${selectedIds.length} products`);
        setSelectedProducts([]);
      },
    },
    {
      id: 'delete',
      label: 'Delete Products',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      confirmMessage: 'This action cannot be undone.',
      action: async (selectedIds: string[]) => {
        const selectedProductObjects = products.filter(p => selectedIds.includes(p.id.toString()));
        console.log('Bulk deleting:', selectedProductObjects);
        success(`Deleted ${selectedIds.length} products successfully`);
        setSelectedProducts([]);
      },
    },
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Photo Magnets':
        return 'bg-blue-100 text-blue-800';
      case 'Fridge Magnets':
        return 'bg-green-100 text-green-800';
      case 'Retro Prints':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewProduct = (product: Product) => {
    console.log('View product:', product);
    // TODO: Navigate to product detail page
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleToggleLock = (product: Product) => {
    console.log('Toggle lock product:', product);
    const action = product.locked ? 'unlocked' : 'locked';
    success(`Product ${action} successfully`);
  };

  const handleDeleteProduct = (product: Product) => {
    warning(`Delete "${product.title}"?`, {
      description: 'This action cannot be undone.',
      actions: [
        {
          label: 'Cancel',
          onClick: () => {},
        },
        {
          label: 'Delete',
          onClick: () => {
            console.log('Delete product:', product);
            success('Product deleted successfully');
          },
          variant: 'destructive',
        },
      ],
    });
  };

  const selectionState = selectedProducts.length === 0 ? 'none' : 
                       selectedProducts.length === products.length ? 'all' : 'partial';

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {!isLoading && products.length > 0 && (
        <BulkActionsBar
          selectedItems={selectedProducts.map(String)}
          totalItems={products.length}
          onSelectAll={() => setSelectedProducts(products.map(p => p.id))}
          onDeselectAll={() => setSelectedProducts([])}
          operations={bulkOperations}
          itemType="products"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {!isLoading && products.length > 0 && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectionState === 'all'}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead className="w-12">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No products found</p>
                    {(searchTerm || categoryFilter !== 'all') && (
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * 12 + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="text-xs text-gray-500">IMG</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getCategoryColor(product.category)}
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.rating ? (
                      <div className="flex items-center">
                        <span className="text-sm">{product.rating.toFixed(1)}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No rating</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.locked ? 'destructive' : 'default'}
                      className={product.locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                    >
                      {product.locked ? (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Active
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleLock(product)}>
                          {product.locked ? (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unlock Product
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Lock Product
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && products.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={12}
          totalItems={products.length}
          startIndex={(currentPage - 1) * 12 + 1}
          endIndex={Math.min(currentPage * 12, products.length)}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
        />
      )}

      {/* Edit Product Dialog */}
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null);
          }}
          onProductUpdated={() => {
            console.log('Product updated');
            setEditingProduct(null);
            success('Product updated successfully');
          }}
        />
      )}
    </div>
  );
};
