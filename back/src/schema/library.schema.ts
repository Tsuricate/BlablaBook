import { z } from 'zod';

import { formatDate } from '../utils/dateFormatter.utils';

export const getUserLibraryQuerySchema = z.object({
  status: z.literal(['read', 'wishlist', 'all']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type LibraryQuerySchema = z.infer<typeof getUserLibraryQuerySchema>;

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'q param is required'),
  status: z.literal(['read', 'wishlist', 'all']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

export const statusSchema = z.object({
  status: z.literal(['read', 'wishlist']),
});

export const bookSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  averageRating: z.number().optional().nullable(),
  ratingCount: z.number().optional().default(0),
  imageLinks: z
    .object({
      smallThumbnail: z.string().optional().nullable(),
      thumbnail: z.string().optional().nullable(),
      small: z.string().optional().nullable(),
      medium: z.string().optional().nullable(),
      large: z.string().optional().nullable(),
      extraLarge: z.string().optional().nullable(),
    })
    .optional(),
  language: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  publishedDate: z.preprocess((value) => {
    typeof value === 'string' ? (value = formatDate(value)) : null;
    return value;
  }, z.date().optional().nullable()),
  isbn10: z.string().optional().nullable(),
  isbn13: z.string().optional().nullable(),
  pageCount: z.number().optional().nullable(),
  publisher: z.preprocess((value) => value ?? 'independant', z.string().min(1)),
  authors: z.array(z.string().min(1)),
  categories: z.array(z.string().min(1)),
});

export const createBookSchema = z.object({
  book: bookSchema,
  status: z.literal(['read', 'wishlist']),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;

export type BookSchema = z.infer<typeof bookSchema>;
