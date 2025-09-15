import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CreateCategoryForm } from '../../components/forms/CreateCategoryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateCategoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleCategoryCreated = () => {
    toast.success('Category created successfully');
    navigate('/categories');
  };

  const handleBack = () => {
    navigate('/categories');
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
              <FolderPlus className="mr-3 h-6 w-6" />
              Create New Category
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new product category to your system
            </p>
          </div>

          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        {/* Create Form */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>
                Enter the details for the new category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCategoryForm onCategoryCreated={handleCategoryCreated} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}