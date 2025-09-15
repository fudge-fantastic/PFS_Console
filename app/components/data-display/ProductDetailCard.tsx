import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
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

interface ProductDetailCardProps {
  product: Product;
}

export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({ product }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'Fridge Magnets':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'Retro Prints':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <span className="ml-2 text-sm text-muted-foreground">out of 5</span>
              </div>
            ) : (
              <span className="text-muted-foreground">No rating yet</span>
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
              className={product.is_locked ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'}
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
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Product Images ({product.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border">
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

      {/* Descriptions */}
      {(product.short_description || product.description) && (
        <div className="space-y-6">
          {product.short_description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Short Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{product.short_description}</p>
              </CardContent>
            </Card>
          )}

          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Full Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Product ID
              </label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                #{product.id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category ID
              </label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                #{product.category_id}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created Date
              </label>
              <p className="text-base">{formatDate(product.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-base">{formatDate(product.updated_at)}</p>
            </div>
          </div>

          {product.images && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Image Count
              </label>
              <p className="text-base">
                {product.images.length} image{product.images.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};