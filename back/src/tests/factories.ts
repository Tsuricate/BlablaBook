import { prisma } from '../utils/prisma.utils';
import { ReadingStatus } from '../../generated/prisma';
import { randomUUID } from 'crypto';

/* ---------------- TYPES ---------------- */

type UserOverrides = Partial<{
  username: string;
  email: string;
  password: string;
}>;

type BookOverrides = Partial<{
  title: string;
  googleBookId: string;
  language: string | null;
  description: string | null;
  authors: string[];
  categories: string[];
  publishedDate: Date | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  imageLinks: {
    smallThumbnail?: string | null;
    thumbnail?: string | null;
    small?: string | null;
    medium?: string | null;
    large?: string | null;
    extraLarge?: string | null;
  } | null;
}>;

type PublisherOverrides = Partial<{
  name: string;
}>;

type CategoryOverrides = Partial<{
  name: string;
}>;

export type LibraryScenarioOverrides = {
  user?: UserOverrides;
  publisher?: PublisherOverrides;
  book?: BookOverrides;
  status?: ReadingStatus;
};

/* ---------------- USER ---------------- */

export const createTestUser = async (overrides: UserOverrides = {}) => {
  return prisma.user.create({
    data: {
      username: `user_${randomUUID()}`,
      email: `test_${randomUUID()}@mail.com`,
      password: 'test',
      ...overrides,
    },
  });
};

/* ---------------- PUBLISHER ---------------- */

export const createTestPublisher = async (overrides: PublisherOverrides = {}) => {
  return prisma.publisher.create({
    data: {
      name: `publisher_${randomUUID()}`,
      ...overrides,
    },
  });
};

/* ---------------- CATEGORY ---------------- */

export const createTestCategory = async (overrides: CategoryOverrides = {}) => {
  return prisma.category.create({
    data: {
      name: `category_${randomUUID()}`,
      ...overrides,
    },
  });
};

/* ---------------- BOOK ---------------- */

export const createTestBook = async (publisherId: number, overrides: BookOverrides = {}) => {
  const book = await prisma.book.create({
    data: {
      title: overrides.title ?? 'test book',
      googleBookId: overrides.googleBookId ?? `google_${randomUUID()}`,
      language: overrides.language ?? null,
      description: overrides.description ?? null,
      publishedDate: overrides.publishedDate ?? null,
      isbn10: overrides.isbn10 ?? null,
      isbn13: overrides.isbn13 ?? null,
      pageCount: overrides.pageCount ?? null,
      imageLinks: overrides.imageLinks ?? undefined,
      publisherId,
    },
  });

  return book;
};

/* ---------------- AUTHOR ---------------- */

export const createTestAuthor = async () => {
  return prisma.author.create({
    data: {
      name: `author_${randomUUID()}`,
    },
  });
};

/* ---------------- USER BOOK ---------------- */

export const createUserBook = async (
  userId: number,
  bookId: number,
  status: ReadingStatus = ReadingStatus.wishlist
) => {
  return prisma.userBook.create({
    data: {
      userId,
      bookId,
      status,
    },
  });
};

/* ---------------- RELATIONS ---------------- */

export const createBookAuthor = async (bookId: number, authorId: number) => {
  return prisma.bookAuthor.create({
    data: { bookId, authorId },
  });
};

export const createBookCategory = async (bookId: number, categoryId: number) => {
  return prisma.bookCategory.create({
    data: { bookId, categoryId },
  });
};

/* ---------------- AUTH ---------------- */

export const createRefreshToken = async (userId: number) => {
  return prisma.refreshToken.create({
    data: {
      token: `token_${randomUUID()}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      userId,
    },
  });
};
