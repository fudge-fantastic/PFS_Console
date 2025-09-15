import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import type { Category, UpdateCategoryRequest } from '../../types/category';

const editCategoryFormSchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  is_active: z.boolean(),
});

type EditCategoryFormData = z.infer<typeof editCategoryFormSchema>;

interface EditCategoryFormProps {
  category: Category;
  onCategoryUpdated?: (category: Category) => void;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  onCategoryUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategoryFormSchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      is_active: category.is_active,
    },
  });

  const onSubmit = async (data: EditCategoryFormData) => {
    try {
      setIsSubmitting(true);

      const updateData: UpdateCategoryRequest = {
        id: category.id,
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        is_active: data.is_active,
      };

      const updatedCategory = await categoryService.updateCategory(updateData);

      toast.success('Category updated successfully');
      onCategoryUpdated?.(updatedCategory);
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                A unique name for this category (max 100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter category description (optional)"
                  {...field}
                  disabled={isSubmitting}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Optional description for this category (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Active Status
                </FormLabel>
                <FormDescription>
                  Controls whether this category is available for use
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Category
          </Button>
        </div>
      </form>
    </Form>
  );
};