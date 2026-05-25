import { Router } from 'express';
import {
  createAndAddBookToLibrary,
  deleteBookFromLibrary,
  getUserLibrary,
  searchInLibrary,
  updateBookStatus,
} from '../controllers/library.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserLibrary);
router.get('/search', authenticateToken, searchInLibrary);
router.post('/', authenticateToken, createAndAddBookToLibrary);
router.patch('/:id', authenticateToken, updateBookStatus);
router.delete('/:id', authenticateToken, deleteBookFromLibrary);

export default router;
