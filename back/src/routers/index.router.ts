import { Router } from 'express';

import booksRouter from './books.router';
import authRouter from './auth.router';
import categoriesRouter from './categories.router';

const router = Router();

router.use('/books', booksRouter);
router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);

export default router;
