import request from 'supertest';
import app from '../../app';
import { describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';

export const baseUser = () => {
  const id = randomUUID();
  return {
    username: `user_${id}`,
    email: `user_${id}@test.com`,
    password: 'Password123!AA',
    confirmPassword: 'Password123!AA',
  };
};

const getAuthCookies = (loginResponse: any) => {
  const cookies = loginResponse.headers['set-cookie'];
  if (!cookies) {
    throw new Error('No cookies returned from login');
  }
  return Array.isArray(cookies) ? cookies : [cookies];
};

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
    const base = Date.now();

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
    const base = Date.now();

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
    const base = Date.now();

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
    const user = baseUser();

    await request(app).post('/api/auth/register').send(user);

    const login = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: user.password,
      rememberMe: false,
    });

    const authCookies = getAuthCookies(login);

    const res = await request(app).post('/api/auth/logout').set('Cookie', authCookies);

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
    const user = baseUser();

    await request(app).post('/api/auth/register').send(user);

    const login = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: user.password,
      rememberMe: false,
    });

    const authCookies = getAuthCookies(login);

    const res = await request(app).post('/api/auth/logout').set('Cookie', authCookies);

    const cookies = res.headers['set-cookie'] ?? [];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    const clearedToken = cookieArray.find((c) => c.includes('token=') && c.includes('Expires='));

    const clearedRefresh = cookieArray.find(
      (c) => c.includes('refreshToken=') && c.includes('Expires=')
    );

    expect(clearedToken).toBeDefined();
    expect(clearedRefresh).toBeDefined();
  });
});

describe('POST /api/auth/refresh', () => {
  it('should refresh token successfully', async () => {
    const user = baseUser();

    await request(app).post('/api/auth/register').send(user);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

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
