import { Navigate, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CategoryDetailCard } from '../../components/data-display/CategoryDetailCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, FolderOpen, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';
import type { Category } from '../../types/category';

export default function CategoryDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    if (!categoryId) return;

    try {
      setIsLoading(true);
      const categoryData = await categoryService.getCategory(categoryId);
      setCategory(categoryData);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      toast.error('Failed to load category details');
      navigate('/categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!category) return;

    try {
      setIsToggling(true);
      const updatedCategory = category.is_active
        ? await categoryService.deactivateCategory(category.id)
        : await categoryService.activateCategory(category.id);

      setCategory(updatedCategory);
      toast.success(`Category ${updatedCategory.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle category status:', error);
      toast.error('Failed to update category status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;

    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(category.id, true); // Hard delete
      toast.success('Category deleted successfully');
      navigate('/categories');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleEdit = () => {
    if (category) {
      navigate(`/categories/${category.id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/categories');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Category not found</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FolderOpen className="mr-3 h-6 w-6" />
              {category.name}
              <Badge
                variant={category.is_active ? "default" : "secondary"}
                className="ml-3"
              >
                {category.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Category details and management
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={isToggling}
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
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Category Details */}
        <div className="max-w-4xl">
          <CategoryDetailCard category={category} />
        </div>
      </div>
    </AdminLayout>
  );
}