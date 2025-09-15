import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

// Product validation schema
export const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Product title is required')
    .min(3, 'Title must be at least 3 characters long'),
  price: z
    .number()
    .min(0.01, 'Price must be greater than 0')
    .max(10000, 'Price cannot exceed ₹10,000'),
  category: z
    .enum(['Photo Magnets', 'Fridge Magnets', 'Retro Prints'], {
      message: 'Please select a category',
    }),
  rating: z
    .number()
    .min(0, 'Rating cannot be negative')
    .max(5, 'Rating cannot exceed 5')
    .optional(),
});

// User validation schema
export const userSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  role: z
    .enum(['admin', 'user'])
    .default('user'),
});

// Export form types
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type UserFormData = z.infer<typeof userSchema>;
