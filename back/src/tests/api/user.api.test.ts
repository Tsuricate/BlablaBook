import request from 'supertest';
import app from '../../app';
import { describe, expect, it } from 'vitest';
import { baseUser, createAuthenticatedUser } from '../helpers/auth';
import { createAuthenticatedClient } from '../helpers/testClient';
import { createTestUser } from '../factories';

describe('PATCH /api/auth/users/:id', () => {
  it('should update user username', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.patch(`/api/auth/users/${user.id}`).send({
      username: 'new_username',
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('new_username');
  });

  it('should return 400 if passwords do not match', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.patch(`/api/auth/users/${user.id}`).send({
      username: 'new_username',
      email: user.email,
      password: user.password,
      confirmPassword: 'wrong',
    });

    expect(res.status).toBe(400);
  });

  it('should return 409 if email already exists', async () => {
    const user1 = baseUser();
    const user2 = baseUser();

    await request(app).post('/api/auth/register').send(user1);
    await request(app).post('/api/auth/register').send(user2);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user1.email, password: user1.password, rememberMe: false });

    const client = createAuthenticatedClient(app, login.body.data.id);

    const res = await client
      .patch(`/api/auth/users/${login.body.data.id}`)
      .send({ email: user2.email });

    expect(res.status).toBe(409);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 409 if username already exists', async () => {
    const user1 = baseUser();
    const user2 = baseUser();

    await request(app).post('/api/auth/register').send(user1);
    await request(app).post('/api/auth/register').send(user2);

    const login = await request(app).post('/api/auth/login').send({
      email: user1.email,
      password: user1.password,
      rememberMe: false,
    });
    const client = createAuthenticatedClient(app, login.body.data.id);
    const res = await client.patch(`/api/auth/users/${login.body.data.id}`).send({
      username: user2.username,
    });

    expect(res.status).toBe(409);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject request without csrf token', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);
    client.setCsrf('');
    const res = await client.patch(`/api/auth/users/${user.id}`).send({
      username: 'new_username',
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/auth/users/:id', () => {
  it('should delete user successfully', async () => {
    const { loginResponse } = await createAuthenticatedUser();

    const userId = loginResponse.body.data.id;
    const client = createAuthenticatedClient(app, userId);

    const res = await client.delete(`/api/auth/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).delete('/api/auth/users/1');

    expect(res.status).toBe(401);
  });

  it('should return 500 if user does not exist', async () => {
    const { loginResponse } = await createAuthenticatedUser();
    const client = createAuthenticatedClient(app, loginResponse.body.data.id);

    const res = await client.delete('/api/auth/users/999999');

    expect(res.status).toBe(404);
  });

  it('should reject request without csrf token', async () => {
    const { loginResponse } = await createAuthenticatedUser();
    const client = createAuthenticatedClient(app, loginResponse.body.data.id);
    client.setCsrf('');

    const res = await client.delete(`/api/auth/users/${loginResponse.body.data.id}`);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user', async () => {
    const { user, authCookies } = await createAuthenticatedUser();

    const res = await request(app).get('/api/auth/me').set('Cookie', authCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body.data).toEqual({
      id: expect.any(Number),
      username: user.username,
      email: user.email,
      createdAt: expect.any(String),
    });
  });
  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Not authenticated');
  });

  it('should return 404 if user no longer exists', async () => {
    const { loginResponse } = await createAuthenticatedUser();
    const client = createAuthenticatedClient(app, loginResponse.body.data.id);

    await client.delete(`/api/auth/users/${loginResponse.body.data.id}`);

    const res = await client.get('/api/auth/me');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
