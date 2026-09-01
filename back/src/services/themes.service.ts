import { searchBooks } from './googleBooks.service';
import { getUserBooksByGoogleBookIds } from './userBook.service';
import {
  buildGoogleBooksQuery,
  getRandomThemes,
  getThemeData,
} from '../utils/topFeaturedThemes.utils';

export const getFeaturedThemesBooks = async (limit: number, lang: 'en' | 'fr') => {
  const randomThemes = getRandomThemes(3);

  const topThemesBooks = await Promise.all(
    randomThemes.map(async (themeKey) => {
      const theme = getThemeData(themeKey, lang);

      // CASE 1: simple search-based theme
      if (theme.type === 'search') {
        const books = await searchBooks(theme.query, limit);
        return [themeKey, books];
      }

      // CASE 2: curated collection theme
      const searchPromises = theme.data.queries.map((book) => {
        const googleQuery = buildGoogleBooksQuery(book.title, book.author);

        return searchBooks(googleQuery, 1);
      });

      const searchResults = await Promise.all(searchPromises);

      const flatResults = searchResults.flat();

      const seenIds = new Set();

      const uniqueBooks = flatResults.filter((book) => {
        if (seenIds.has(book.id)) return false;
        seenIds.add(book.id);
        return true;
      });

      const selectedBooks = uniqueBooks.slice(0, limit);

      return [themeKey, selectedBooks];
    })
  );

  return Object.fromEntries(topThemesBooks);
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
