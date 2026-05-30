import { randomUUID } from 'crypto';
import request from 'supertest';
import app from '../../app';

export const baseUser = () => {
  const id = randomUUID();

  return {
    id: Number(id),
    username: `user_${id}`,
    email: `user_${id}@test.com`,
    password: 'Password123!AA',
    confirmPassword: 'Password123!AA',
  };
};

export const getAuthCookies = (response: { headers: { ['set-cookie']?: string | string[] } }) => {
  const cookies = response.headers['set-cookie'];

  if (!cookies) {
    throw new Error('No authentication cookies found');
  }

  return Array.isArray(cookies) ? cookies : [cookies];
};

export const createAuthenticatedUser = async () => {
  const user = baseUser();
  await request(app).post('/api/auth/register').send(user);

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: user.email,
    password: user.password,
    rememberMe: false,
  });

  const authCookies = getAuthCookies(loginResponse);

  return { user, loginResponse, authCookies };
};

export const createAuthCookie = (token: string) => {
  return [`token=${token}`];
};
