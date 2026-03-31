import { Router } from 'express';
import { getUserLibrary, searchInLibrary } from '../controllers/library.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/library
 * Retrieves all books belonging to the authenticated user.
 * This route is protected by the authenticateToken middleware to ensure
 * that only authenticated users can access their library.
 */
router.get('/', authenticateToken, getUserLibrary);
router.get('/search', authenticateToken, searchInLibrary);

export default router;
