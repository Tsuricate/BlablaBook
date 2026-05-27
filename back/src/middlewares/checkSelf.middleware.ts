import type { NextFunction, Response } from 'express';

import { authenticateToken, type AuthRequest } from './auth.middleware';

export const checkSelf = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies['token'];

    if (token) {
      return authenticateToken(req, res, next);
    }

    return next();
  };
};
