import request from 'supertest';
import app from '../../app';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as booksService from '../../services/book.service';
import { randomUUID } from 'crypto';

vi.mock('../../services/book.service');
vi.mock('axios');

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  isAxiosError: (error: any) => boolean;
};

mockedAxios.isAxiosError = (error: any) => Boolean(error?.response);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/books/search', () => {
  it('should return books on valid query', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        items: [{ id: '1', volumeInfo: { title: 'Clean Code' } }],
      },
    });

    const res = await request(app).get('/api/books/search?q=clean');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it('should return 400 if query is invalid', async () => {
    const res = await request(app).get('/api/books/search?q=');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return empty array if external API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Google API down'));

    const res = await request(app).get('/api/books/search?q=error');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/books/:id', () => {
  it('should return book without authentication', async () => {
    const mockedEnsureBookExists = vi.mocked(booksService.ensureBookExists);
    const mockedGetUserBookStatus = vi.mocked(booksService.getUserBookStatus);

    mockedEnsureBookExists.mockResolvedValue({ id: 1, googleBookId: 'abc123' } as any);
    mockedGetUserBookStatus.mockResolvedValue(null);

    const res = await request(app).get('/api/books/abc123');

    expect(res.status).toBe(200);
    expect(res.body.status).toBeNull();
  });

  it('should return book with user status when authenticated', async () => {
    const user = {
      username: `user_${randomUUID()}`,
      email: `user_${randomUUID()}@test.com`,
      password: 'Password123!A',
      confirmPassword: 'Password123!A',
    };

    await request(app).post('/api/auth/register').send(user);

    const login = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: user.password,
      rememberMe: false,
    });

    const cookies = login.headers['set-cookie'];

    vi.mocked(booksService.ensureBookExists).mockResolvedValue({
      id: 1,
      googleBookId: 'abc123',
    } as any);

    vi.mocked(booksService.getUserBookStatus).mockResolvedValue('read');

    const res = await request(app).get('/api/books/abc123').set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('read');
  });

  it('should return 404 if book not found (Google API)', async () => {
    const mockedEnsureBookExists = vi.mocked(booksService.ensureBookExists);

    mockedEnsureBookExists.mockRejectedValue({
      response: { status: 404 },
    } as any);

    const res = await request(app).get('/api/books/unknown-id');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Livre introuvable');
  });
});
