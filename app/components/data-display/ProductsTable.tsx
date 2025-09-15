import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { Input } from '../ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Lock, Unlock, Trash2, AlertCircle, Search, Columns3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { DataTablePagination } from './DataTablePagination';
import { BulkActionsBar } from '../advanced/BulkActionsBar';
import { EditProductDialog } from '../forms/EditProductDialog';
import { useProducts } from '../../hooks/useProducts';
import { toast } from 'sonner';
import { productService } from '../../services/product.service';
import type { Product } from '../../types/product';

interface ProductsTableProps {
  searchTerm?: string;
  categoryFilter?: string;
  statusFilter?: 'all' | 'active' | 'locked';
  categories?: string[];
  onSearchChange?: (v: string) => void;
  onCategoryChange?: (v: string) => void;
  onStatusChange?: (v: 'all' | 'active' | 'locked') => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  searchTerm = '',
  categoryFilter = 'all',
  statusFilter = 'all',
  categories = [],
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}) => {
  const {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch: refetchProducts
  } = useProducts({ searchTerm, categoryFilter, statusFilter });
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Column visibility state with localStorage persistence
  const [columnVisibility, setColumnVisibility] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('products-column-visibility');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fall back to defaults if parsing fails
        }
      }
    }
    return {
      id: true,
      product: true,
      shortDescription: false,
      description: false,
      category: true,
      price: true,
      rating: true,
      status: true,
      actions: true,
    };
  });

  // Toggle column visibility and persist to localStorage
  const toggleColumn = (column: keyof typeof columnVisibility) => {
    setColumnVisibility((prev: typeof columnVisibility) => {
      const newVisibility = {
        ...prev,
        [column]: !prev[column]
      };
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('products-column-visibility', JSON.stringify(newVisibility));
      }
      
      return newVisibility;
    });
  };

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
    navigate(`/products/${product.id}`);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleToggleLock = async (product: Product) => {
    try {
      if (product.is_locked) {
        await productService.unlockProduct(product.id);
        toast.success('Product unlocked successfully');
      } else {
        await productService.lockProduct(product.id);
        toast.success('Product locked successfully');
      }
      refetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    toast.custom(
      (t) => (
        <div className="flex items-start space-x-3 p-4 bg-background border rounded-lg shadow-lg min-w-[350px]">
          <div className="mt-0.5">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-medium text-sm">Delete "{product.title}"?</div>
            <div className="text-sm text-muted-foreground">
              This action cannot be undone.
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1 text-xs rounded-md transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await productService.deleteProduct(product.id);
                    toast.success('Product deleted successfully');
                    refetchProducts();
                  } catch (err) {
                    toast.error('Failed to delete product');
                  }
                  toast.dismiss(t);
                }}
                className="px-3 py-1 text-xs rounded-md transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  // Bulk selection helpers
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((pid) => pid !== productId) : [...prev, productId]
    );
  };

  const selectionState =
    selectedProducts.length === 0
      ? 'none'
      : selectedProducts.length === products.length
      ? 'all'
      : 'partial';

  // Bulk operations for products
  const productBulkOperations = [
    {
      id: 'lock',
      label: 'Lock Products',
      icon: <Lock className="h-4 w-4" />,
      confirmMessage:
        'Lock selected products? Locked products will be hidden from customers.',
      action: async (selectedIds: string[]) => {
        await Promise.all(
          selectedIds.map((id) => productService.lockProduct(id))
        );
        toast.success(`Locked ${selectedIds.length} products`);
        setSelectedProducts([]);
        refetchProducts();
      },
    },
    {
      id: 'unlock',
      label: 'Unlock Products',
      icon: <Unlock className="h-4 w-4" />,
      action: async (selectedIds: string[]) => {
        await Promise.all(
          selectedIds.map((id) => productService.unlockProduct(id))
        );
        toast.success(`Unlocked ${selectedIds.length} products`);
        setSelectedProducts([]);
        refetchProducts();
      },
    },
    {
      id: 'delete',
      label: 'Delete Products',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive' as const,
      confirmMessage:
        'Permanently delete the selected products? This cannot be undone.',
      action: async (selectedIds: string[]) => {
        await Promise.all(
          selectedIds.map((id) => productService.deleteProduct(id))
        );
        toast.success(`Deleted ${selectedIds.length} products`);
        setSelectedProducts([]);
        refetchProducts();
      },
    },
  ];



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

  // Derived counts (client-side quick stats like the Tasks demo)
  const totalCount = products.length;
  const activeCount = products.filter(p => !p.is_locked).length;
  const lockedCount = products.filter(p => p.is_locked).length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar - Always show to prevent layout shift */}
      <BulkActionsBar
        selectedItems={selectedProducts}
        totalItems={products.length}
        onSelectAll={() => setSelectedProducts(products.map((p) => p.id))}
        onDeselectAll={() => setSelectedProducts([])}
        operations={productBulkOperations}
        itemType="products"
        disabled={isLoading || products.length === 0}
      />

      {/* Toolbar similar to shadcn Tasks: search + status filter + category filter + column selector */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing</span>
          <span className="font-medium text-foreground">{totalCount}</span>
          <span>products</span>
          <span className="hidden sm:inline">·</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{activeCount} active</span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">{lockedCount} locked</span>
          </div>
        </div>
        <div className="flex flex-1 md:flex-none items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search products, descriptions..."
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: any) => onStatusChange?.(v)}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          {onCategoryChange && (
            <Select value={categoryFilter} onValueChange={(v) => onCategoryChange?.(v)}>
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Column Visibility Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9" size="sm">
                <Columns3 className="h-4 w-4 mr-1" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Show Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility.id}
                onCheckedChange={() => toggleColumn('id')}
              >
                ID
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.product}
                onCheckedChange={() => toggleColumn('product')}
              >
                Product
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.shortDescription}
                onCheckedChange={() => toggleColumn('shortDescription')}
              >
                Short Description
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.description}
                onCheckedChange={() => toggleColumn('description')}
              >
                Description
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.category}
                onCheckedChange={() => toggleColumn('category')}
              >
                Category
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.price}
                onCheckedChange={() => toggleColumn('price')}
              >
                Price
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.rating}
                onCheckedChange={() => toggleColumn('rating')}
              >
                Rating
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={() => toggleColumn('status')}
              >
                Status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="outline"
              className="h-9"
              onClick={() => {
                onSearchChange?.('');
                onCategoryChange?.('all');
                onStatusChange?.('all');
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>


  <div className="rounded-2xl border bg-zinc-50 dark:bg-zinc-950 shadow-md dark:shadow-none overflow-x-auto">
        <Table className="rounded-2xl min-w-full text-[15px]">
          <TableHeader className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900">
            <TableRow className="">
              {/* Bulk selection checkbox - Always show to prevent layout shift */}
              <TableHead className="w-12 px-4 py-3 rounded-tl-2xl">
                <Checkbox
                  checked={
                    selectionState === 'all'
                      ? true
                      : selectionState === 'partial'
                      ? 'indeterminate'
                      : false
                  }
                  onCheckedChange={handleSelectAll}
                  disabled={isLoading || products.length === 0}
                />
              </TableHead>
              {columnVisibility.id && <TableHead className="w-auto px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">#</TableHead>}
              {columnVisibility.product && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Product</TableHead>}
              {columnVisibility.shortDescription && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Short Description</TableHead>}
              {columnVisibility.description && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Description</TableHead>}
              {columnVisibility.category && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Category</TableHead>}
              {columnVisibility.price && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Price</TableHead>}
              {columnVisibility.rating && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Rating</TableHead>}
              {columnVisibility.status && <TableHead className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide">Status</TableHead>}
              {columnVisibility.actions && <TableHead className="text-right px-5 py-3 font-bold text-zinc-700 dark:text-zinc-200 text-base tracking-wide rounded-tr-2xl">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-[400px]">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className={i % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-950/80' : 'bg-white dark:bg-zinc-900/80'}>
                  {/* Checkbox column skeleton */}
                  <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {columnVisibility.id && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                  )}
                  {columnVisibility.product && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.shortDescription && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                  )}
                  {columnVisibility.description && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-4 w-60" />
                    </TableCell>
                  )}
                  {columnVisibility.category && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                  )}
                  {columnVisibility.price && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  )}
                  {columnVisibility.rating && (
                    <TableCell className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                  )}
                  {columnVisibility.actions && (
                    <TableCell className="text-right px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
      ) : products.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={
                    1 + // checkbox column (always present now)
                    Object.values(columnVisibility).filter(Boolean).length
                  } 
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p className="text-sm">No products match your filters</p>
                    {(searchTerm || categoryFilter !== 'all') && (
                      <p className="text-xs mt-1">
                        Try adjusting your search or filters
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={
                    `${index % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-950/80' : 'bg-white dark:bg-zinc-900/80'} ` +
                    'group border-b border-zinc-200 dark:border-zinc-800'
                  }
                >
                  {/* Bulk selection checkbox per row */}
                  <TableCell className="px-5 py-4 rounded-l-xl border-b border-zinc-200 dark:border-zinc-800">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                    />
                  </TableCell>
                  {columnVisibility.id && (
                    <TableCell className="font-medium px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      {(currentPage - 1) * 12 + index + 1}
                    </TableCell>
                  )}
                  {columnVisibility.product && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="h-12 w-12 object-cover rounded-xl"
                            />
                          ) : (
                            <span className="text-xs">IMG</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-base group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">{product.title}</div>
                          <div className="text-xs">ID: {product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.shortDescription && (
                    <TableCell className="max-w-xs px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      {product.short_description ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm truncate">
                              {product.short_description}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>{product.short_description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="italic text-sm">No short description</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.description && (
                    <TableCell className="max-w-md px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      {product.description ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm line-clamp-2">
                              {product.description}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p className="whitespace-pre-wrap">{product.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="italic text-sm">No description</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.category && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Badge 
                        variant="secondary"
                        className={getCategoryColor(product.category_name) + ' rounded-full px-3 py-1 text-xs font-semibold'}
                      >
                        {product.category_name}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.price && (
                    <TableCell className="font-medium px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      {formatPrice(product.price)}
                    </TableCell>
                  )}
                  {columnVisibility.rating && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      {product.rating ? (
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{product.rating.toFixed(1)}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                      ) : (
                        <span className="text-sm">No rating</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium border ${
                          product.is_locked 
                            ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400' 
                            : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400'
                        }`}
                      >
                        {product.is_locked ? (
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
                  )}
                  {columnVisibility.actions && (
                    <TableCell className="text-right px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 rounded-r-xl">
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
                            {product.is_locked ? (
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
                  )}
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
            toast.success('Product updated successfully');
            refetchProducts();
          }}
        />
      )}

    </div>
  );
};
