import { Router } from 'express';
import { getCategories, getBooksByCategory } from '../controllers/categories.controller.js';

const categoriesRouter = Router();

// GET /api/categories
categoriesRouter.get('/', getCategories);

// GET /api/categories/:category?limit=20&page=1
categoriesRouter.get('/:category', getBooksByCategory);

export default categoriesRouter;
