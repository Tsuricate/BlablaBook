import { Router } from 'express';
import {
  getCurrentUserController,
  loginUserController,
  registerUserController,
  refreshTokenController,
  deleteUserController,
  logoutUserController,
  patchUserController,
  getCsrfTokenController,
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { csrfProtection } from '../middlewares/csrf.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.get('/me', authenticateToken, getCurrentUserController);
authRouter.post('/refresh', refreshTokenController);
authRouter.delete('/users/:id', authenticateToken, csrfProtection, deleteUserController);
authRouter.patch('/users/:id', authenticateToken, csrfProtection, patchUserController);
authRouter.post('/logout', authenticateToken, csrfProtection, logoutUserController);
authRouter.get('/csrf', getCsrfTokenController);

export default authRouter;
