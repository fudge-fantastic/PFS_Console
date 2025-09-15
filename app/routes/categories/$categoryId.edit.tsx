import { Navigate, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EditCategoryForm } from '../../components/forms/EditCategoryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, FolderEdit } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';
import type { Category } from '../../types/category';

export default function EditCategoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategory(updatedCategory);
    toast.success('Category updated successfully');
    navigate(`/categories/${updatedCategory.id}`);
  };

  const handleBack = () => {
    if (category) {
      navigate(`/categories/${category.id}`);
    } else {
      navigate('/categories');
    }
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
              <FolderEdit className="mr-3 h-6 w-6" />
              Edit Category: {category.name}
              <Badge
                variant={category.is_active ? "default" : "secondary"}
                className="ml-3"
              >
                {category.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Modify category information and settings
            </p>
          </div>

          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Category
          </Button>
        </div>

        {/* Edit Form */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>
                Update the category details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCategoryForm
                category={category}
                onCategoryUpdated={handleCategoryUpdated}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}