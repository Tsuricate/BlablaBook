import { Response } from 'express';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
};

export const clearCookiesUser = (res: Response): void => {
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
