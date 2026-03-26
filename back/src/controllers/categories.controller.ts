import type { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../../generated/prisma/client.js';

const prisma = new PrismaClient();

const CATEGORIES_LIMIT = 50;

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
    const category = await prisma.category.findFirst({
      where: { name: { contains: categoryName, mode: 'insensitive' } },
    });

    if (!category) {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: { categories: { some: { categoryId: category.id } } },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          imageLinks: true,
          averageRating: true,
          publishedDate: true,
          authors: { select: { author: { select: { name: true } } } },
        },
      }),
      prisma.book.count({
        where: { categories: { some: { categoryId: category.id } } },
      }),
    ]);

    res.json({
      category: category.name,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      books: books.map((b) => ({
        ...b,
        authors: b.authors.map((a) => a.author.name),
      })),
    });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
