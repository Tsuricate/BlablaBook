import { Router } from 'express';
import {
  getUserLibrary,
  searchInLibrary,
  updateBookStatus,
} from '../controllers/library.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/library
 * Retrieves all books belonging to the authenticated user.
 * This route is protected by the authenticateToken middleware to ensure
 * that only authenticated users can access their library.
 */
router.get('/', authenticateToken, getUserLibrary);

/**
 * GET /api/library/search
 * Searches for books in the authenticated user's library based on query parameters.
 * This route is protected by the authenticateToken middleware to ensure
 * that only authenticated users can search their library.
 */
router.get('/search', authenticateToken, searchInLibrary);

/**
 * PATCH /api/library/:id
 * Updates the status of a specific book in the authenticated user's library.
 * This route is protected by the authenticateToken middleware to ensure
 * that only authenticated users can update their library.
 */
router.patch('/:id', authenticateToken, updateBookStatus);

export default router;
