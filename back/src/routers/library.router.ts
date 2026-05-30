import { Router } from 'express';
import {
  createAndAddBookToLibrary,
  deleteBookFromLibrary,
  getUserLibrary,
  searchInLibrary,
  updateBookStatus,
} from '../controllers/library.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { csrfProtection } from '../middlewares/csrf.middleware';

const router = Router();

router.get('/', authenticateToken, getUserLibrary);
router.get('/search', authenticateToken, searchInLibrary);
router.post('/', authenticateToken, csrfProtection, createAndAddBookToLibrary);
router.patch('/:id', authenticateToken, csrfProtection, updateBookStatus);
router.delete('/:id', authenticateToken, csrfProtection, deleteBookFromLibrary);

export default router;
