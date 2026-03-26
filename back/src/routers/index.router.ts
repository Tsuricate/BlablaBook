import { Router } from 'express';

import booksRouter from './books.router';
import authRouter from './auth.router';

const router = Router();

router.use('/books', booksRouter);
router.use('/auth', authRouter);

export default router;
