import type { Request, Response } from 'express';
import { z } from 'zod';
import { type GoogleBook, searchBooks } from '../services/googleBooks.service';
import { topFeaturedThemes, getRandomThemes } from '../utils/topFeaturedThemes.utils';

/**
 * Controller for handling top featured themes requests.
 *
 * Retrieves the top featured books for predefined themes.
 *
 * Expected query parameters:
 *   - limit: Maximum number of results per page (default: 20, max: 40)
 */
export const getTopFeaturedThemes = async (req: Request, res: Response): Promise<void> => {
  const paginationSchema = z.object({
    limit: z.coerce.number().min(1).max(40).default(20), // SearchBooks() coerces a limit of 40
  });

  const randomThemes = getRandomThemes(3);

  try {
    // Validate and parse pagination parameters from query string
    const parsed = paginationSchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
      return;
    }

    const { limit } = parsed.data;

    const topThemesBooks = await Promise.all(
      randomThemes.map(async (theme) => {
        const books: GoogleBook[] = await searchBooks(topFeaturedThemes[theme], limit);
        return [theme, books];
      })
    );

    const data = Object.fromEntries(topThemesBooks);

    res.json(data);
    // TODO: Implement error handler
  } catch (error) {
    res.status(502).json({ error: 'Something wrong with Google Books API' });
    if (error instanceof Error) {
      console.log(error.name, error.message);
    }
  }
};
