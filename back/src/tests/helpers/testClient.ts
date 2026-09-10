import request from 'supertest';
import type { Express } from 'express';
import { generateTestToken } from './generateTestToken';
import { createAuthCookie } from './auth';

export const createTestClient = (app: Express) => {
  const agent = request.agent(app);

  let csrfToken = 'test-csrf-token';
  let cookies: string[] = [];

  const attach = (req: any) => {
    req.set('Cookie', [...cookies, `csrf_token=${csrfToken}`]);
    req.set('x-csrf-token', csrfToken);
    return req;
  };

  return {
    get: (url: string) => attach(agent.get(url)),
    post: (url: string) => attach(agent.post(url)),
    patch: (url: string) => attach(agent.patch(url)),
    delete: (url: string) => attach(agent.delete(url)),

    setCookies: (newCookies: string[]) => {
      cookies = newCookies;
    },

    setCsrf: (token: string) => {
      csrfToken = token;
    },
  };
};

export const createAuthenticatedClient = (app: Express, userId: number) => {
  const token = generateTestToken(userId);
  const client = createTestClient(app);

  client.setCookies(createAuthCookie(token));
  client.setCsrf('test-csrf-token');

  return client;
};
