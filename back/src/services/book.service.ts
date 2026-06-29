import { cleanImageLinks, cleanOtherBookData } from '../utils/cleanSanitizedData.utils';
import { prisma } from '../utils/prisma.utils';
import { getBookById as fetchGoogleBook } from './googleBooks.service';
import { createAndGetAuthors, createAndGetCategories } from './library.service';

// TODO: remove any, add proper GoogleBook typing normalization, refacto with library service
export const createBookInDbOnly = async (googleBookData: any) => {
  const authors = googleBookData.authors
    ? await createAndGetAuthors(cleanOtherBookData(googleBookData.authors))
    : [];

  const categories = googleBookData.categories
    ? await createAndGetCategories(cleanOtherBookData(googleBookData.categories))
    : [];

  const createdBook = await prisma.book.create({
    include: {
      publisher: true,
      authors: { include: { author: true } },
      categories: { include: { category: true } },
    },
    data: {
      title: googleBookData.title,
      imageLinks: cleanImageLinks(googleBookData.imageLinks),
      language: googleBookData.language,
      description: googleBookData.description,
      googleBookId: googleBookData.id,
      publishedDate: googleBookData.publishedDate,
      isbn10: googleBookData.isbn10,
      isbn13: googleBookData.isbn13,
      pageCount: googleBookData.pageCount,
      publisher: {
        connectOrCreate: {
          create: {
            name: cleanOtherBookData(googleBookData.publisher),
          },
          where: {
            name: cleanOtherBookData(googleBookData.publisher),
          },
        },
      },
    },
  });

  if (authors.length) {
    await prisma.bookAuthor.createMany({
      data: authors.map((author) => ({
        bookId: createdBook.id,
        authorId: author.id,
      })),
    });
  }

  if (categories.length) {
    await prisma.bookCategory.createMany({
      data: categories.map((category) => ({
        bookId: createdBook.id,
        categoryId: category.id,
      })),
    });
  }

  return createdBook;
};

export const ensureBookExists = async (googleBookId: string) => {
  // Try DB first
  let book = await prisma.book.findUnique({
    where: { googleBookId },
    include: {
      publisher: { select: { name: true } },
      authors: { include: { author: { select: { name: true } } } },
      categories: { include: { category: { select: { name: true } } } },
    },
  });

  // If not in DB → fetch from Google
  if (!book) {
    const googleBookData = await fetchGoogleBook(googleBookId);

    // persist en DB if book not already found in DB
    book = await createBookInDbOnly(googleBookData);
  }

  return book;
};

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
