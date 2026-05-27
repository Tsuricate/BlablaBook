import type { Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';

import { searchBooks } from '../services/googleBooks.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { formatBook } from '../services/library.service';
import { ensureBookExists, getUserBookStatus } from '../services/book.service';

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Le paramètre q est requis'),
  maxResults: z.coerce.number().min(1).max(40).optional(),
  startIndex: z.coerce.number().min(0).optional().default(0),
  lang: z.string().optional().default('en'),
});

export const search = async (req: Request, res: Response): Promise<void> => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const { q, maxResults, startIndex } = parsed.data;
    const books = await searchBooks(q, maxResults, startIndex);
    res.json(books);
  } catch {
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsedId = z.string().min(1).safeParse(req.params.id);
  if (!parsedId.success) {
    res.status(400).json({
      success: false,
      error: z.flattenError(parsedId.error).fieldErrors,
    });
    return;
  }

  const googleBookId = parsedId.data as string;
  const userId = req.userId as number;

  try {
    // GUARANTEE: we always get a DB book (either existing or created from Google Books)
    const book = await ensureBookExists(googleBookId);

    const baseBook = formatBook(book);

    let status: string | null = null;

    if (userId) {
      status = await getUserBookStatus(userId, book.id);
    }

    res.status(200).json({
      ...baseBook,
      status,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      res.status(404).json({ error: 'Livre introuvable' });
      return;
    }
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
};
