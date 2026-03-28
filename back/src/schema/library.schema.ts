import { z } from 'zod';

export const getUserLibraryQuerySchema = z.object({
  status: z
    .string()
    .refine((value) => value === 'read' || value === 'wishlist' || value === 'all', {
      message: 'Status must be read, whislist or all',
    })
    .optional()
    .default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type LibraryQuerySchema = z.infer<typeof getUserLibraryQuerySchema>;

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'q param is required'),
  status: z
    .string()
    .refine((value) => value === 'read' || value === 'wishlist' || value === 'all', {
      message: 'Status must be read, whislist or all',
    })
    .optional()
    .default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

export const statusSchema = z.object({
  status: z.literal(['read', 'wishlist']),
});
