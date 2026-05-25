import { prisma } from './helpers/prismaTestClient';
import { ReadingStatus } from '../../generated/prisma';

/* ---------------- TYPES ---------------- */

type UserOverrides = Partial<{
  username: string;
  email: string;
  password: string;
}>;

type BookOverrides = Partial<{
  title: string;
  googleBookId: string;
  language: string;
  description: string;
}>;

type PublisherOverrides = Partial<{
  name: string;
}>;

type CategoryOverrides = Partial<{
  name: string;
}>;

/* ---------------- USER ---------------- */

export const createTestUser = async (overrides: UserOverrides = {}) => {
  return prisma.user.create({
    data: {
      username: `user_${Date.now()}`,
      email: `test_${Date.now()}@mail.com`,
      password: 'test',
      ...overrides,
    },
  });
};

/* ---------------- PUBLISHER ---------------- */

export const createTestPublisher = async (overrides: PublisherOverrides = {}) => {
  return prisma.publisher.create({
    data: {
      name: `publisher_${Date.now()}`,
      ...overrides,
    },
  });
};

/* ---------------- CATEGORY ---------------- */

export const createTestCategory = async (overrides: CategoryOverrides = {}) => {
  return prisma.category.create({
    data: {
      name: `category_${Date.now()}`,
      ...overrides,
    },
  });
};

/* ---------------- BOOK ---------------- */

export const createTestBook = async (publisherId: number, overrides: BookOverrides = {}) => {
  return prisma.book.create({
    data: {
      title: 'test book',
      googleBookId: `google_${Date.now()}`,
      publisherId,
      ...overrides,
    },
  });
};

/* ---------------- AUTHOR ---------------- */

export const createTestAuthor = async () => {
  return prisma.author.create({
    data: {
      name: `author_${Date.now()}`,
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
      token: `token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      userId,
    },
  });
};
