import { Navigate, useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ProductDetailCard } from '../../components/data-display/ProductDetailCard';
import { EditProductDialog } from '../../components/forms/EditProductDialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Package, Trash2, Lock, Unlock } from 'lucide-react';
import { productService } from '../../services/product.service';
import { toast } from 'sonner';
import type { Product } from '../../types/product';

export default function ProductDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      const productData = await productService.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;

    try {
      setIsToggling(true);
      if (product.is_locked) {
        await productService.unlockProduct(product.id);
        setProduct({ ...product, is_locked: false });
        toast.success('Product unlocked successfully');
      } else {
        await productService.lockProduct(product.id);
        setProduct({ ...product, is_locked: true });
        toast.success('Product locked successfully');
      }
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      toast.error('Failed to update product status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productService.deleteProduct(product.id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProduct();
  };

  const handleBack = () => {
    navigate('/products');
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Product not found</div>
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
              <Package className="mr-3 h-6 w-6" />
              {product.title}
              <Badge
                variant={product.is_locked ? "destructive" : "default"}
                className="ml-3"
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
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Product details and management • ID: {product.id}
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
              {product.is_locked ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Lock
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

        {/* Product Details */}
        <div className="max-w-6xl">
          <ProductDetailCard product={product} />
        </div>

        {/* Edit Product Dialog */}
        <EditProductDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          product={product}
          onProductUpdated={handleProductUpdated}
        />
      </div>
    </AdminLayout>
  );
}
