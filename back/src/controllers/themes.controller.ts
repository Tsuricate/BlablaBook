import type { Request, Response } from 'express';
import { z } from 'zod';
import { searchBooks } from '../services/googleBooks.service';
import {
  buildGoogleBooksQuery,
  getRandomThemes,
  getThemeData,
} from '../utils/topFeaturedThemes.utils';

export const getTopFeaturedThemes = async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    limit: z.coerce.number().min(1).max(40).default(20),
    lang: z.enum(['en', 'fr']).default('en'),
  });

  try {
    const parsedQuery = schema.safeParse(req.query);

    if (!parsedQuery.success) {
      res.status(400).json({ error: z.flattenError(parsedQuery.error).fieldErrors });
      return;
    }

    const { limit, lang } = parsedQuery.data;

    const randomThemes = getRandomThemes(3);

    const topThemesBooks = await Promise.all(
      randomThemes.map(async (themeKey) => {
        const theme = getThemeData(themeKey, lang);

        // CASE 1: simple search-based theme (direct Google Books query)
        if (theme.type === 'search') {
          const books = await searchBooks(theme.query, limit);
          return [themeKey, books];
        }

        // CASE 2: curated collection theme
        // Each book is searched individually to ensure better precision
        const searchPromises = theme.data.queries.map((book) => {
          const googleQuery = buildGoogleBooksQuery(book.title, book.author);

          return searchBooks(googleQuery, 1);
        });

        const searchResults = await Promise.all(searchPromises);

        // Flatten results from multiple API calls into a single array
        const flatResults = searchResults.flat();

        // Remove duplicate books based on Google Books ID
        const seenIds = new Set();

        const uniqueBooks = flatResults.filter((book) => {
          if (seenIds.has(book.id)) return false;
          seenIds.add(book.id);
          return true;
        });

        // Limit final output per theme
        const selectedBooks = uniqueBooks.slice(0, limit);

        return [themeKey, selectedBooks];
      })
    );

    const responseData = Object.fromEntries(topThemesBooks);

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(502).json({
      error: 'Something wrong with Google Books API',
    });
  }
};
