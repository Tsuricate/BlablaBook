import { Router } from 'express';
import { getById, search } from '../controllers/books.controller';
import { getTopFeaturedThemes } from '../controllers/themes.controller';

const booksRouter = Router();

booksRouter.get('/topFeaturedThemes', getTopFeaturedThemes);

// GET /api/books/search?q=fondation&maxResults=20
booksRouter.get('/search', search);

// GET /api/books/:id
booksRouter.get('/:id', getById);

export default booksRouter;
