import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { FolderOpen, Calendar, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Category } from '../../types/category';

interface CategoryDetailCardProps {
  category: Category;
}

export const CategoryDetailCard: React.FC<CategoryDetailCardProps> = ({ category }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Category Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category Name
              </label>
              <p className="text-base font-medium">{category.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? (
                    <>
                      <ToggleRight className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="mr-1 h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {category.description && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  Description
                </label>
                <p className="text-base mt-1 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category ID
              </label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {category.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="text-base">{formatDate(category.created_at)}</p>
            </div>

            {category.updated_at && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-base">{formatDate(category.updated_at)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};