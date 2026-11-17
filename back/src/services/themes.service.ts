import { getUserBooksByGoogleBookIds } from './userBook.service';
import { pickRandom } from '../utils/topFeaturedThemes.utils';
import { prisma } from '../utils/prisma.utils';
import { formatBook } from './library.service';

export const getRandomCollections = async (count = 5) => {
  const allCollections = await prisma.collection.findMany({
    select: { id: true, key: true },
  });

  return pickRandom(allCollections, count);
};

const getCollectionBooks = async (collectionId: number, limit: number, lang: 'en' | 'fr') => {
  const books = await prisma.book.findMany({
    where: {
      language: lang,
      collections: { some: { collectionId } },
    },
    include: {
      publisher: true,
      authors: { include: { author: true } },
      categories: { include: { category: true } },
    },
    take: limit,
  });

  return books.map(formatBook);
};

export const getFeaturedThemesBooks = async (limit: number, lang: 'en' | 'fr') => {
  const randomCollections = await getRandomCollections(5);

  const themesBooks = await Promise.all(
    randomCollections.map(async ({ id, key }) => {
      const books = await getCollectionBooks(id, limit, lang);
      return [key, books] as const;
    })
  );

  return Object.fromEntries(themesBooks);
};

export const enrichFeaturedThemesWithUserLibrary = async (
  responseData: Record<string, any[]>,
  userId?: number
) => {
  if (!userId) {
    return Object.fromEntries(
      Object.entries(responseData).map(([theme, books]) => [
        theme,
        books.map((book) => ({
          ...book,
          status: null,
          rating: null,
        })),
      ])
    );
  }

  const googleBookIds = Object.values(responseData)
    .flat()
    .map((book) => book.googleBookId);

  const booksInUserLibrary = await getUserBooksByGoogleBookIds(userId, googleBookIds);

  const libraryStatusByGoogleBookId = new Map(
    booksInUserLibrary.map((userBook) => [userBook.googleBookId, userBook])
  );

  return Object.fromEntries(
    Object.entries(responseData).map(([theme, books]) => [
      theme,
      books.map((book) => {
        const libraryData = libraryStatusByGoogleBookId.get(book.googleBookId);
        return {
          ...book,
          bookId: libraryData?.bookId ?? null,
          status: libraryData?.status ?? null,
          rating: libraryData?.rating ?? null,
        };
      }),
    ])
  );
};
