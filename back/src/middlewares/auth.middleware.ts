import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['token'];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const payload = jwt.verify(token, secret) as { id: number };
    req.userId = payload.id;

    next();
  } catch (error) {
    console.error('authenticateToken error', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
