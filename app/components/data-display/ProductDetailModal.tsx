import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Lock, 
  Unlock, 
  Package, 
  FileText,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  if (!product) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{product.title}</DialogTitle>
          <DialogDescription>
            Product ID: {product.id} • View all product details and information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Header Section with Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge 
                    variant="secondary"
                    className={getCategoryColor(product.category_name)}
                  >
                    {product.category_name}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Rating and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {product.rating ? (
                    <div className="flex items-center">
                      <span className="text-xl font-semibold">{product.rating.toFixed(1)}</span>
                      <Star className="ml-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-2 text-sm text-gray-500">out of 5</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No rating yet</span>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge
                    variant={product.is_locked ? 'destructive' : 'default'}
                    className={product.is_locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
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
                </CardContent>
              </Card>
            </div>

            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Product Images ({product.images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${product.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Short Description */}
            {product.short_description && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Short Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {product.short_description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Full Description */}
            {product.description && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Full Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Product Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Technical details and timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 mb-1">Product ID</dt>
                    <dd className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      #{product.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 mb-1">Category ID</dt>
                    <dd className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      #{product.category_id}
                    </dd>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 mb-1">Created Date</dt>
                    <dd className="text-xs">{formatDate(product.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 mb-1">Last Updated</dt>
                    <dd className="text-xs">{formatDate(product.updated_at)}</dd>
                  </div>
                </div>

                {product.images && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500 mb-1">Image Count</dt>
                    <dd className="text-xs">
                      {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                    </dd>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
