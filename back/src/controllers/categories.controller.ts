import type { Request, Response } from 'express';
import z from 'zod';
import { getBooksBySubject } from '../services/googleBooks.service';
import { paginationSchema, subjectSchema } from '../schema/categories.schema';

// GET /api/categories/:category?page=1&limit=20
export const getBooksByCategory = async (
  req: Request<{ category: string }>,
  res: Response
): Promise<void> => {
  const parsedPagination = paginationSchema.safeParse(req.query);
  const parsedSubject = subjectSchema.safeParse(req.params.category);

  if (!parsedPagination.success) {
    res
      .status(400)
      .json({ succes: false, error: z.flattenError(parsedPagination.error).fieldErrors });
    return;
  }

  if (!parsedSubject.success) {
    res.status(400).json({ succes: false, error: z.flattenError(parsedSubject.error).fieldErrors });
    return;
  }

  const { limit, page, lang } = parsedPagination.data;

  const categoryName = parsedSubject.data.trim();

  try {
    const { books, totalItems } = await getBooksBySubject(categoryName, page, limit, lang);

    if (totalItems === 0) {
      res.status(404).json({ success: false, error: 'CATEGORY_NOT_FOUND' });
      return;
    }

    const offset = (page - 1) * limit;
    const hasNext = offset + limit < totalItems;
    const hasPrevious = offset > 0;

    res.status(200).json({
      pagination: { total: totalItems, page, hasNext, hasPrevious },
      category: categoryName,
      books: books,
    });
  } catch {
    res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};
