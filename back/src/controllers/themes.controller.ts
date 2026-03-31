import type { Request, Response } from 'express';
import { z } from 'zod';
import { searchBooks } from '../services/googleBooks.service';
import {
  buildGoogleBooksQuery,
  getRandomThemes,
  getThemeData,
} from '../utils/topFeaturedThemes.utils';

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
    lang: z.enum(['en', 'fr']).default('en'),
  });

  try {
    // Validate and parse pagination parameters from query string
    const parsed = paginationSchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
      return;
    }

    const { limit, lang } = parsed.data;

    const randomThemes = getRandomThemes(3);

    const topThemesBooks = await Promise.all(
      randomThemes.map(async (themeKey) => {
        const theme = getThemeData(themeKey, lang);

        // CASE 1: controlled themes -> single search
        if (theme.type === 'search') {
          const books = await searchBooks(theme.query, limit);
          return [themeKey, books];
        }

        // CASE 2: collections → one search per query, then merge + deduplicate results
        const booksArraysRes = await Promise.all(
          theme.data.queries.map((book) =>
            searchBooks(buildGoogleBooksQuery(book.title, book.author), 1)
          )
        );

        const booksArrays = booksArraysRes.flat().slice(0, limit);

        const books = booksArrays
          .flat()
          .filter(
            (book, index, allBooks) =>
              allBooks.findIndex((otherBook) => otherBook.id === book.id) === index
          )
          .slice(0, limit);

        return [themeKey, books];
      })
    );

    const data = Object.fromEntries(topThemesBooks);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(502).json({
      error: 'Something wrong with Google Books API',
    });
  }
};
