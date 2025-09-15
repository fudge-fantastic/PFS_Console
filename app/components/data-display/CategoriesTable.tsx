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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { DataTablePagination } from './DataTablePagination';
import { BulkActionsBar } from '../advanced/BulkActionsBar';
import { EditCategoryDialog } from '../forms/EditCategoryDialog';
import { useCategories } from '../../hooks/useCategories';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';
import type { Category } from '../../types/category';

interface CategoriesTableProps {
  searchTerm?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
  refreshTrigger?: number;
  onCategoryUpdated?: () => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  searchTerm = '',
  statusFilter = 'all',
  refreshTrigger = 0,
  onCategoryUpdated,
}) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const {
    categories,
    isLoading,
    total,
    currentPage,
    totalPages,
    refetch,
    goToPage,
  } = useCategories({
    searchTerm,
    statusFilter,
    refreshTrigger,
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(category => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      setIsToggling(category.id);
      const updatedCategory = category.is_active
        ? await categoryService.deactivateCategory(category.id)
        : await categoryService.activateCategory(category.id);

      toast.success(`Category ${updatedCategory.is_active ? 'activated' : 'deactivated'} successfully`);
      refetch();
      onCategoryUpdated?.();
    } catch (error) {
      console.error('Failed to toggle category status:', error);
      toast.error('Failed to update category status');
    } finally {
      setIsToggling(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(categoryId);
      await categoryService.deleteCategory(categoryId, true); // Hard delete
      toast.success('Category deleted successfully');
      refetch();
      onCategoryUpdated?.();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(null);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCategories.length > 0 && (
        <BulkActionsBar
          selectedItems={selectedCategories}
          totalItems={categories.length}
          onSelectAll={() => setSelectedCategories(categories.map(c => c.id))}
          onDeselectAll={() => setSelectedCategories([])}
          operations={[
            {
              id: 'activate',
              label: 'Activate',
              icon: <ToggleRight className="h-4 w-4" />,
              action: async (selectedIds) => {
                await Promise.all(selectedIds.map(id => categoryService.activateCategory(id)));
                toast.success(`${selectedIds.length} categories activated`);
                setSelectedCategories([]);
                refetch();
                onCategoryUpdated?.();
              }
            },
            {
              id: 'deactivate',
              label: 'Deactivate',
              icon: <ToggleLeft className="h-4 w-4" />,
              action: async (selectedIds) => {
                await Promise.all(selectedIds.map(id => categoryService.deactivateCategory(id)));
                toast.success(`${selectedIds.length} categories deactivated`);
                setSelectedCategories([]);
                refetch();
                onCategoryUpdated?.();
              }
            },
            {
              id: 'delete',
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              variant: 'destructive' as const,
              confirmMessage: 'Are you sure you want to delete the selected categories? This action cannot be undone.',
              action: async (selectedIds) => {
                await Promise.all(selectedIds.map(id => categoryService.deleteCategory(id, true)));
                toast.success(`${selectedIds.length} categories deleted`);
                setSelectedCategories([]);
                refetch();
                onCategoryUpdated?.();
              }
            },
          ]}
          itemType="categories"
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCategory(category.id, checked as boolean)
                      }
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{category.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-xs truncate">
                      {category.description || 'No description'}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(category.created_at)}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/categories/${category.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(category)}
                          disabled={isToggling === category.id}
                        >
                          {category.is_active ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting === category.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting === category.id ? 'Deleting...' : 'Delete'}
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

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={12}
        startIndex={(currentPage - 1) * 12 + 1}
        endIndex={Math.min(currentPage * 12, total)}
        hasNextPage={currentPage < totalPages}
        hasPrevPage={currentPage > 1}
        onPageChange={goToPage}
      />

      {editingCategory && (
        <EditCategoryDialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          category={editingCategory}
          onCategoryUpdated={() => {
            refetch();
            onCategoryUpdated?.();
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};