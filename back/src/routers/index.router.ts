import { Router } from 'express';

import booksRouter from './books.router';
import authRouter from './auth.router';
import libraryRouter from './library.router';

const router = Router();

router.use('/books', booksRouter);
router.use('/auth', authRouter);
router.use('/library', libraryRouter);

export default router;
