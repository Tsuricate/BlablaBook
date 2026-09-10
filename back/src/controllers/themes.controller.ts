import type { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

import {
  enrichFeaturedThemesWithUserLibrary,
  getFeaturedThemesBooks,
} from '../services/themes.service';

export const getTopFeaturedThemes = async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({
    limit: z.coerce.number().min(1).max(40).default(20),
    lang: z.enum(['en', 'fr']).default('en'),
  });

  try {
    const parsedQuery = schema.safeParse(req.query);
    const userId = req.userId;

    if (!parsedQuery.success) {
      res.status(400).json({ error: z.flattenError(parsedQuery.error).fieldErrors });
      return;
    }

    const { limit, lang } = parsedQuery.data;

    const responseData = await getFeaturedThemesBooks(limit, lang);

    const featuredBooksWithLibraryData = await enrichFeaturedThemesWithUserLibrary(
      responseData,
      userId
    );

    res.json(featuredBooksWithLibraryData);
  } catch (error) {
    console.error(error);
    res.status(502).json({
      error: 'Something wrong with Google Books API',
    });
  }
};
