import request from 'supertest';
import app from '../../app';
import { vi, describe, expect, it, beforeEach } from 'vitest';

import { createLibraryScenario, createMultiLibraryScenario } from '../scenarios';
import { generateTestToken } from '../helpers/generateTestToken';
import { createTestBook, createTestPublisher, createTestUser } from '../factories';

import { getBookById, GoogleBook } from '../../services/googleBooks.service';
import { createAuthCookie } from '../helpers/auth';
import { createAuthenticatedClient } from '../helpers/testClient';

/* ---------------- MOCK GOOGLE BOOKS ---------------- */

vi.mock('../../services/googleBooks.service', () => ({
  getBookById: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- FIXTURES ---------------- */

const GOOGLE_BOOK_ID = 'zjLaEAAAQBAJ';
const mockGoogleBook: GoogleBook = {
  id: GOOGLE_BOOK_ID,
  googleBookId: GOOGLE_BOOK_ID,
  title: 'Arthur Conan Doyle',
  authors: ['François Rivière'],
  publisher: 'Tallandier',
  publishedDate: null,
  description: 'Biographie',
  isbn10: undefined,
  isbn13: '9791021055148',
  pageCount: 109,
  categories: ['Biography & Autobiography'],
  imageLinks: {
    smallThumbnail: 'http://img',
    thumbnail: 'http://img',
  },
  language: 'fr',
};

const makeBookPayload = (
  overrides: Partial<{
    id: string;
    title: string;
    authors: string[];
    categories: string[];
  }> = {}
) => ({
  id: GOOGLE_BOOK_ID,
  title: 'Arthur Conan Doyle',
  authors: ['François Rivière'],
  categories: ['Biography & Autobiography'],
  ...overrides,
});

/* ---------------- GET /library ---------------- */

describe('GET /library', () => {
  it('should return user library with pagination', async () => {
    const { user } = await createLibraryScenario();
    const token = generateTestToken(user.id);

    const response = await request(app)
      .get('/api/library?page=1&limit=20')
      .set('Cookie', createAuthCookie(token));

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination).toMatchObject({
      total: 1,
      page: 1,
      hasNext: false,
      hasPrevious: false,
    });
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app).get('/api/library');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return 400 for invalid query params', async () => {
    const { user } = await createLibraryScenario();
    const token = generateTestToken(user.id);

    const response = await request(app)
      .get('/api/library?limit=invalid')
      .set('Cookie', createAuthCookie(token));

    expect(response.status).toBe(400);
  });

  it('should handle pagination correctly', async () => {
    const { user } = await createMultiLibraryScenario();
    const token = generateTestToken(user.id);

    const response = await request(app)
      .get('/api/library?limit=1&page=1')
      .set('Cookie', createAuthCookie(token));

    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.total).toBe(2);
    expect(response.body.pagination.hasNext).toBe(true);
  });
});

/* ---------------- POST /library ---------------- */

describe('POST /library', () => {
  it('should add existing book to library', async () => {
    const user = await createTestUser();
    const publisher = await createTestPublisher();
    const book = await createTestBook(publisher.id);
    const client = createAuthenticatedClient(app, user.id);

    const response = await client.post('/api/library').send({
      book: {
        id: book.googleBookId,
        title: book.title,
        authors: ['John'],
        categories: ['Tech'],
      },
      status: 'read',
    });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
  });

  it('should return 400 if book already in library', async () => {
    const { user, book } = await createLibraryScenario();
    const client = createAuthenticatedClient(app, user.id);

    const response = await client.post('/api/library').send({
      book: {
        id: book.googleBookId,
        title: book.title,
        authors: ['John'],
        categories: ['Tech'],
      },
      status: 'read',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('BOOK_ALREADY_IN_LIBRARY');
  });

  it('should create and add new book from google api', async () => {
    const user = await createTestUser();
    (getBookById as any).mockResolvedValue(mockGoogleBook);
    const client = createAuthenticatedClient(app, user.id);

    const response = await client.post('/api/library').send({
      book: makeBookPayload(),
      status: 'read',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('should reject request without csrf token', async () => {
    const user = await createTestUser();
    const client = createAuthenticatedClient(app, user.id);
    client.setCsrf('');

    const response = await client.post('/api/library').send({
      book: {
        id: 'test',
        title: 'test',
        authors: ['John'],
        categories: ['Tech'],
      },
      status: 'read',
    });

    expect(response.status).toBe(403);
  });
});

/* ---------------- PATCH /library ---------------- */

describe('PATCH /library', () => {
  it('should update book status', async () => {
    const { user, book } = await createLibraryScenario({ status: 'read' });
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.patch(`/api/library/${book.id}`).send({ status: 'wishlist' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('wishlist');
  });

  it('should return 404 if book not in library', async () => {
    const user = await createTestUser();
    const publisher = await createTestPublisher();
    const book = await createTestBook(publisher.id);

    const client = createAuthenticatedClient(app, user.id);

    const res = await client.patch(`/api/library/${book.id}`).send({ status: 'read' });

    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid status', async () => {
    const { user, book } = await createLibraryScenario();
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.patch(`/api/library/${book.id}`).send({ status: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual(expect.objectContaining({ success: false, error: expect.anything() }));
  });

  it('should return 401 when no token', async () => {
    const res = await request(app).patch('/api/library/1').send({ status: 'read' });

    expect(res.status).toBe(401);
  });

  it('should reject request without csrf token', async () => {
    const { user, book } = await createLibraryScenario();
    const client = createAuthenticatedClient(app, user.id);
    client.setCsrf('');

    const res = await client.patch(`/api/library/${book.id}`).send({ status: 'wishlist' });

    expect(res.status).toBe(403);
  });
});

/* ---------------- DELETE /library ---------------- */

describe('DELETE /library', () => {
  it('should delete book from library', async () => {
    const { user, book } = await createLibraryScenario();
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.delete(`/api/library/${book.id}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 if book not in library', async () => {
    const user = await createTestUser();
    const publisher = await createTestPublisher();
    const book = await createTestBook(publisher.id);
    const client = createAuthenticatedClient(app, user.id);

    const res = await client.delete(`/api/library/${book.id}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Book doesn't exist in library");
  });

  it('should return 401 when no token', async () => {
    const res = await request(app).delete('/api/library/1');

    expect(res.status).toBe(401);
  });

  it('should reject request without csrf token', async () => {
    const { user, book } = await createLibraryScenario();
    const client = createAuthenticatedClient(app, user.id);
    client.setCsrf('');
    const res = await client.delete(`/api/library/${book.id}`);

    expect(res.status).toBe(403);
  });
});
