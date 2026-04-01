import type { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../../generated/prisma/client.js';
import { getBooksBySubject } from '../services/googleBooks.service.js';

const prisma = new PrismaClient();

const CATEGORIES_LIMIT = 15;

// GET /api/categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      take: CATEGORIES_LIMIT,
      orderBy: { books: { _count: 'desc' } },
      select: { name: true },
    });

    res.json(categories.map((category) => category.name));
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

// GET /api/categories/:category
export const getBooksByCategory = async (
  req: Request<{ category: string }>,
  res: Response
): Promise<void> => {
  const parsed = paginationSchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { limit, page } = parsed.data;
  const categoryName = req.params.category;

  try {
    const { books, totalItems } = await getBooksBySubject(categoryName.trim(), page, limit);

    if (totalItems === 0) {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    res.json({
      category: categoryName.trim(),
      total: totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      books: books.map((b) => ({
        id: b.id,
        title: b.title,
        imageLinks: b.imageLinks ?? {},
        averageRating: b.averageRating ?? null,
        publishedDate: b.publishedDate ? String(b.publishedDate) : null,
        authors: b.authors ?? [],
        categories: b.categories ?? [],
      })),
    });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
