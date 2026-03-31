import { z } from 'zod';
import type { Response } from 'express';

import type { AuthRequest } from '../middlewares/auth.middleware';
import { getUserBooksByQuery, getUserLibraryBooks, formatBooks } from '../services/library.service';
import {
  getUserLibraryQuerySchema,
  searchQuerySchema,
  type LibraryQuerySchema,
  type SearchQuerySchema,
} from '../schema/library.schema';

/**
 * Retrieves all books belonging to a connected user with pagination support.
 * This function queries the database for books associated with the user's ID,
 * which is extracted from the authenticated request. Pagination is handled
 * by the backend with a default limit of 20 books per page and an starting offset of 0.
 *
 * @param req - The authenticated request object containing the user's ID.
 * @param res - The response object used to send the books data or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const getUserLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed: z.ZodSafeParseResult<LibraryQuerySchema> = getUserLibraryQuerySchema.safeParse(
    req.query
  );

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const userId = req.userId;
    const query = parsed.data;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = query?.limit ? query?.limit : 20; // Default limit of 20 books per page
    const offset = query?.page ? (query.page - 1) * limit : 0; // Default offset starting at 0
    const page = query.page;

    const { userBooks, total } = await getUserLibraryBooks(userId, query?.status, limit, offset);

    // Calculate pagination metadata
    const hasNext = offset + limit < total;
    const hasPrevious = offset > 0;

    const formattedBooks = formatBooks(userBooks);

    res.json({
      pagination: { total, page, hasNext, hasPrevious },
      data: formattedBooks,
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * Searches for books in a user's library with optional query filtering and pagination.
 *
 * @param req - The authenticated request object containing the user's ID and search parameters.
 * @param res - The response object used to send the search results or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const searchInLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed: z.ZodSafeParseResult<SearchQuerySchema> = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const userId = req.userId;
    const query = parsed.data;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = query?.limit ? query?.limit : 20; // Default limit of 20 books per page
    const offset = query?.page ? (query.page - 1) * limit : 0; // Default offset starting at 0
    const page = query.page;

    const { userBooks, total } = await getUserBooksByQuery(
      userId,
      query?.q,
      query?.status,
      limit,
      offset
    );

    // Calculate pagination metadata
    const hasNext = offset + limit < total;
    const hasPrevious = offset > 0;

    const formattedBooks = formatBooks(userBooks);

    res.json({
      pagination: { total, page, hasNext, hasPrevious },
      data: formattedBooks,
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
