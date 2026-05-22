import { z } from 'zod';
import type { Response } from 'express';

import type { AuthRequest } from '../middlewares/auth.middleware';
import {
  getUserBooksByQuery,
  getUserLibraryBooks,
  formatBooks,
  findBookInLibrary,
  updateUserBook,
  deleteUserBook,
  checkIsBookExist,
  addBookToLibrary,
  createBook,
} from '../services/library.service';
import {
  createBookSchema,
  getUserLibraryQuerySchema,
  searchQuerySchema,
  statusSchema,
  type LibraryQuerySchema,
  type SearchQuerySchema,
} from '../schema/library.schema';
import { checkIdFromParams } from '../lib/validators';
import { getBookById } from '../services/googleBooks.service';

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

    const limit = query?.limit ? query?.limit : 20; // Default limit of 20 books per page
    const offset = query?.page ? (query.page - 1) * limit : 0; // Default offset starting at 0
    const page = query.page;

    const { userBooks, total } = await getUserLibraryBooks(userId, query?.status, limit, offset);

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

export const updateBookStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const bookId = await checkIdFromParams(req.params.id as string);
  const userBookId = { userId, bookId };

  const userBook = await findBookInLibrary(userBookId);
  if (!userBook) {
    res.status(404).json({ error: "Book doesn't exist in library" });
  }

  const parsed = statusSchema.safeParse(req.body);

  if (parsed.error) {
    res.status(400).json({ success: false, error: z.flattenError(parsed.error).fieldErrors });
  }

  try {
    const data = await updateUserBook(userBookId, parsed.data?.status);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const deleteBookFromLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const bookId = await checkIdFromParams(req.params.id as string);
  const userBookId = { userId, bookId };

  const userBook = await findBookInLibrary(userBookId);
  if (!userBook) {
    res.status(404).json({ error: "Book doesn't exist in library" });
  }

  try {
    await deleteUserBook(userBookId);

    res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const createAndAddBookToLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;

  try {
    const { book, status } = createBookSchema.parse(req.body);

    const foundBook = await checkIsBookExist(book.id);

    if (foundBook) {
      const userBookId = {
        userId: userId,
        bookId: foundBook.id,
      };

      const userBook = await findBookInLibrary(userBookId);
      if (userBook) {
        res.status(400).json({
          success: false,
          error: 'BOOK_ALREADY_IN_LIBRARY',
        });
        return;
      }

      const data = {
        ...userBookId,
        status: status,
      };

      await addBookToLibrary(data);
    } else {
      const googleBook = await getBookById(book.id);
      book.categories = googleBook.categories ? googleBook.categories : [];
      const createdBook = await createBook(googleBook);
      await addBookToLibrary({
        userId,
        bookId: createdBook.id,
        status,
      });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'INTERNAL_SERVER_ERROR',
    });
    return;
  }
};
