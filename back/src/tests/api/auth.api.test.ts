import request from 'supertest';
import app from '../../app';
import { describe, expect, it } from 'vitest';

let i = 0;

const baseUser = () => {
  const base = Date.now();
  return {
    username: `user_${base}_${++i}`,
    email: `user_${base}_${++i}@test.com`,
    password: 'Password123!AA',
    confirmPassword: 'Password123!AA',
  };
};

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const base = Date.now();

    const payload = {
      username: `user_${base}_1`,
      email: `user_${base}_1@test.com`,
      password: 'Password123!A',
      confirmPassword: 'Password123!A',
    };

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

describe('PATCH /api/auth/users/:id', () => {
  it('should update user username', async () => {
    const user = baseUser();
    await request(app).post('/api/auth/register').send(user);
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

    const userId = login.body.data.id;
    const res = await request(app)
      .patch(`/api/auth/users/${userId}`)
      .set('Cookie', login.headers['set-cookie'])
      .send({
        username: 'new_username',
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('new_username');
  });

  it('should return 400 if passwords do not match', async () => {
    const user = baseUser();
    await request(app).post('/api/auth/register').send(user);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

    const userId = login.body.data.id;
    const res = await request(app)
      .patch(`/api/auth/users/${userId}`)
      .set('Cookie', login.headers['set-cookie'])
      .send({
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

    const res = await request(app)
      .patch(`/api/auth/users/${login.body.data.id}`)
      .set('Cookie', login.headers['set-cookie'])
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

    const res = await request(app)
      .patch(`/api/auth/users/${login.body.data.id}`)
      .set('Cookie', login.headers['set-cookie'])
      .send({
        username: user2.username,
      });

    expect(res.status).toBe(409);
    expect(res.body.errors).toBeDefined();
  });
});

describe('DELETE /api/auth/users/:id', () => {
  it('should delete user successfully', async () => {
    const user = baseUser();

    await request(app).post('/api/auth/register').send(user);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

    const userId = login.body.data.id;

    const res = await request(app)
      .delete(`/api/auth/users/${userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).delete('/api/auth/users/1');

    expect(res.status).toBe(401);
  });

  it('should return 500 if user does not exist', async () => {
    const user = baseUser();

    await request(app).post('/api/auth/register').send(user);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password, rememberMe: false });

    const res = await request(app)
      .delete('/api/auth/users/999999')
      .set('Cookie', login.headers['set-cookie']);

    expect(res.status).toBe(404);
  });
});
