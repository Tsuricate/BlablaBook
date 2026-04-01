import { Response } from 'express';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict';
  path: string;
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api',
};

export const clearCookiesUser = (res: Response): void => {
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshtoken', cookieOptions);
};
