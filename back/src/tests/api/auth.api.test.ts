import request from 'supertest';
import app from '../../app';
import { describe, expect, it } from 'vitest';
import { baseUser, createAuthenticatedUser } from '../helpers/auth';
import { randomUUID } from 'crypto';
import { createAuthenticatedClient } from '../helpers/testClient';
import { createTestUser } from '../factories';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const payload = baseUser();

    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      username: payload.username,
      email: payload.email,
    });
  });

  it('should return 400 if passwords do not match', async () => {
    const base = randomUUID();

    const payload = {
      username: `user_${base}_2`,
      email: `user_${base}_2@test.com`,
      password: 'Password123!A',
      confirmPassword: 'Different123!A',
    };

    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
  });

  it('should return 409 if email already exists', async () => {
    const base = randomUUID();

    const existing = {
      username: `user_${base}_3`,
      email: `user_${base}_3@test.com`,
      password: 'Password123!A',
      confirmPassword: 'Password123!A',
    };

    await request(app).post('/api/auth/register').send(existing);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: `user_${base}_3_bis`,
        email: existing.email,
        password: 'Password123!A',
        confirmPassword: 'Password123!A',
      });

    expect(res.status).toBe(409);
  });

  it('should return 409 if username already exists', async () => {
    const base = randomUUID();

    const existing = {
      username: `user_${base}_4`,
      email: `user_${base}_4@test.com`,
      password: 'Password123!A',
      confirmPassword: 'Password123!A',
    };

    await request(app).post('/api/auth/register').send(existing);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: existing.username,
        email: `user_${base}_4_bis@test.com`,
        password: 'Password123!A',
        confirmPassword: 'Password123!A',
      });

    expect(res.status).toBe(409);
  });

  it('should return 500 for invalid body', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: '',
      email: 'invalid',
      password: 'short',
      confirmPassword: 'short',
    });

    expect(res.status).toBe(500);
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const user = baseUser();
    await request(app).post('/api/auth/register').send(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      id: expect.any(Number),
      username: user.username,
      email: user.email,
    });

    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 if email does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'fake@test.com',
      password: 'Password123!A',
      rememberMe: false,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('INVALID_CREDENTIALS');
  });

  it('should return 401 if password is wrong', async () => {
    const user = baseUser();
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: 'WrongPassword123!A',
      rememberMe: false,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('INVALID_CREDENTIALS');
  });

  it('should return 400 for invalid body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'invalid', password: '' });
    expect(res.status).toBe(500);
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout successfully', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.post('/api/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logout successful');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should clear authentication cookies on logout', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);
    const res = await client.post('/api/auth/logout');

    const cookies = res.headers['set-cookie'] ?? [];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    const clearedToken = cookieArray.find(
      (cookie) => cookie.includes('token=') && cookie.includes('Expires=')
    );

    const clearedRefresh = cookieArray.find(
      (cookie) => cookie.includes('refreshToken=') && cookie.includes('Expires=')
    );

    expect(clearedToken).toBeDefined();
    expect(clearedRefresh).toBeDefined();
  });

  it('should reject request without csrf token', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);
    client.setCsrf('');

    const res = await client.post('/api/auth/logout');

    expect(res.status).toBe(403);
  });
});

describe('POST /api/auth/refresh', () => {
  it('should refresh token successfully', async () => {
    const { loginResponse, user } = await createAuthenticatedUser();

    const setCookieHeader = loginResponse.headers['set-cookie'];

    expect(setCookieHeader).toBeDefined();

    const refreshTokenCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find((cookie) => cookie.startsWith('refreshToken='))
      : setCookieHeader;

    expect(refreshTokenCookie).toBeDefined();

    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', refreshTokenCookie as string);

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.success).toBe(true);
    expect(refreshResponse.body.data).toEqual({
      id: expect.any(Number),
      username: user.username,
      email: user.email,
    });

    expect(refreshResponse.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 if no refresh token is provided', async () => {
    const response = await request(app).post('/api/auth/refresh');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No refresh token provided');
  });

  it('should return 401 if refresh token is invalid', async () => {
    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', 'refreshToken=invalid_token');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or expired refresh token');
  });
});

describe('GET /api/auth/csrf', () => {
  it('should return csrf token and set cookie', async () => {
    const res = await request(app).get('/api/auth/csrf');

    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBeDefined();

    const cookies = res.headers['set-cookie'] ?? [];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    const csrfCookie = cookieArray.find((c) => c.includes('csrf_token='));
    expect(csrfCookie).toBeDefined();
  });

  it('should return different csrf tokens on multiple calls', async () => {
    const res1 = await request(app).get('/api/auth/csrf');
    const res2 = await request(app).get('/api/auth/csrf');

    expect(res1.body.csrfToken).not.toBe(res2.body.csrfToken);
  });
});
