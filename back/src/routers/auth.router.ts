import { Router } from 'express';
import {
  getCurrentUserController,
  loginUserController,
  registerUserController,
  refreshTokenController,
  deleteUserController,
  logoutUserController,
  patchUserController,
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.get('/me', authenticateToken, getCurrentUserController);
authRouter.post('/refresh', refreshTokenController);
authRouter.delete('/users/:id', authenticateToken, deleteUserController);
authRouter.patch('/users/:id', authenticateToken, patchUserController);
authRouter.post('/logout', authenticateToken, logoutUserController);

export default authRouter;
