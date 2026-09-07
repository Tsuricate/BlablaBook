import { prisma } from '../utils/prisma.utils';

export const getUserBook = async (userId: number, bookId: number) => {
  const userBook = await prisma.userBook.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
    select: {
      status: true,
      rating: true,
      startedAt: true,
      finishedAt: true,
    },
  });

  return userBook;
};

export const getUserBooksByGoogleBookIds = async (userId: number, googleBookIds: string[]) => {
  const userBooks = await prisma.userBook.findMany({
    where: {
      userId,
      book: {
        googleBookId: { in: googleBookIds },
      },
    },
    select: {
      status: true,
      rating: true,
      book: {
        select: { id: true, googleBookId: true },
      },
    },
  });

  return userBooks.map((userBook) => ({
    bookId: userBook.book.id,
    googleBookId: userBook.book.googleBookId,
    status: userBook.status,
    rating: userBook.rating,
  }));
};
