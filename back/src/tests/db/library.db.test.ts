import { describe, it, expect } from 'vitest';
import { prisma } from '../../utils/prisma.utils';
import { createLibraryScenario, createMultiLibraryScenario } from '../scenarios';
import { createTestUser } from '../factories';
import { ReadingStatus } from '../../../generated/prisma';

describe('Library (DB integration)', () => {
  it('should return user library books', async () => {
    const { user, book } = await createLibraryScenario();

    const result = await prisma.userBook.findMany({
      where: { userId: user.id },
    });

    expect(result).toHaveLength(1);
    expect(result[0].bookId).toBe(book.id);
  });

  it('should filter by status', async () => {
    const { user } = await createLibraryScenario({
      status: ReadingStatus.read,
    });

    const result = await prisma.userBook.findMany({
      where: { userId: user.id, status: ReadingStatus.read },
    });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(ReadingStatus.read);
  });
});

describe('searchInLibrary (DB integration)', () => {
  it('should search books by title', async () => {
    const { user, book1 } = await createMultiLibraryScenario();

    const result = await prisma.userBook.findMany({
      where: {
        userId: user.id,
        book: {
          title: {
            contains: 'react',
            mode: 'insensitive',
          },
        },
      },
      include: { book: true },
    });

    expect(result).toHaveLength(1);
    expect(result[0].book.id).toBe(book1.id);
  });

  it('should filter by query + status', async () => {
    const { user } = await createMultiLibraryScenario();

    const result = await prisma.userBook.findMany({
      where: {
        userId: user.id,
        status: 'wishlist',
        book: {
          title: {
            contains: 'node',
            mode: 'insensitive',
          },
        },
      },
    });

    expect(result).toHaveLength(1);
  });
});

describe('delete book from library (DB integration)', () => {
  it('should delete a book from library', async () => {
    const { userBook } = await createLibraryScenario();

    await prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId: userBook.userId,
          bookId: userBook.bookId,
        },
      },
    });

    const deleted = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: userBook.userId,
          bookId: userBook.bookId,
        },
      },
    });

    expect(deleted).toBeNull();
  });
});

describe('empty library', () => {
  it('should return empty library', async () => {
    const user = await createTestUser({
      username: `empty_${Date.now()}`,
      email: `empty_${Date.now()}@mail.com`,
    });

    const result = await prisma.userBook.findMany({
      where: { userId: user.id },
    });

    expect(result).toEqual([]);
  });
});
