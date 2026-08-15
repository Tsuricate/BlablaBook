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
    },
  });

  return userBook;
};

export const getUserBooksByGoogleBookIds = async (userId: number, googleBookIds: string[]) => {
  return prisma.userBook.findMany({
    where: {
      userId,
      book: {
        googleBookId: {
          in: googleBookIds,
        },
      },
    },
    select: {
      status: true,
      rating: true,
      book: {
        select: {
          googleBookId: true,
        },
      },
    },
  });
};
