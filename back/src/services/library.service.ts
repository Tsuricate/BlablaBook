import {
  Author,
  Category,
  Prisma,
  prisma,
  type ReadingStatus,
  type UserBook,
} from '../utils/prisma.utils';
import type { UserBookWithDetails, UserBookPk, BookWithRelations } from '../types/userBook.types';
import { cleanImageLinks, cleanOtherBookData } from '../utils/cleanSanitizedData.utils';
import { GoogleBook } from './googleBooks.service';

/**
 * Formats an array of user books by extracting and transforming book details.
 * Extracts author names, publisher name, category names, and normalizes image links.
 *
 * @param userBooks - Array of user books with detailed book information
 * @returns Array of formatted user books with simplified book data structure
 */
export const formatBooks = (userBooks: UserBookWithDetails[]) => {
  return userBooks.map((userBook) => {
    const bookData = userBook.book;

    // Normalize image links structure, handling potential undefined or non-object values
    let imageLinks = null;
    if (bookData.imageLinks && typeof bookData.imageLinks === 'object') {
      imageLinks = {
        thumbnail: (bookData.imageLinks as any).thumbnail || '',
        small: (bookData.imageLinks as any).small,
        medium: (bookData.imageLinks as any).medium,
        large: (bookData.imageLinks as any).large,
      };
    }

    return {
      ...userBook,
      book: {
        ...bookData,
        status: userBook.status,
        imageLinks,
        authors: bookData.authors?.map((author) => author.author.name) || [],
        publisher: bookData.publisher?.name || null,
        categories: bookData.categories?.map((category) => category.category.name) || [],
      },
    };
  });
};

export const formatBook = (book: BookWithRelations) => {
  let imageLinks = null;
  if (book.imageLinks && typeof book.imageLinks === 'object') {
    imageLinks = {
      thumbnail: (book.imageLinks as any).thumbnail || '',
      small: (book.imageLinks as any).small,
      medium: (book.imageLinks as any).medium,
      large: (book.imageLinks as any).large,
    };
  }

  return {
    ...book,
    imageLinks,
    authors: book.authors?.map((author) => author.author.name) || [],
    publisher: book.publisher?.name || null,
    categories: book.categories?.map((category) => category.category.name) || [],
  };
};

const getUserBooks = async (userId: number, offset: number, limit: number) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: { name: true },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

const getUserBooksByStatus = async (
  userId: number,
  status: string | 'all' | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      status: status as ReadingStatus,
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: { name: true },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

const countUserBooksByStatus = async (userId: number, status: string | 'all' | undefined) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      status: status as ReadingStatus,
    },
  });
};

const countUserBooks = async (userId: number) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
    },
  });
};

const searchInUserBooks = async (
  userId: number,
  query: string | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      book: {
        OR: [
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

const searchInUserBooksByStatus = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined,
  offset: number,
  limit: number
) => {
  return await prisma.userBook.findMany({
    where: {
      userId: userId,
      status: status as ReadingStatus,
      book: {
        OR: [
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
    include: {
      book: {
        include: {
          authors: {
            select: {
              author: {
                select: { name: true },
              },
            },
          },
          publisher: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              category: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });
};

const countSearchingInLibraryResultsByStatus = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined
) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      status: status as ReadingStatus,
      book: {
        OR: [
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
  });
};

const countAllSearchingInLibraryResults = async (userId: number, query: string | undefined) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      book: {
        OR: [
          // Search in author names
          {
            authors: {
              some: {
                author: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
  });
};

export const getUserBooksByQuery = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total;

  if (status && status !== 'all') {
    userBooks = await searchInUserBooksByStatus(userId, query, status, offset, limit);
    total = await countSearchingInLibraryResultsByStatus(userId, query, status);
  } else {
    userBooks = await searchInUserBooks(userId, query, offset, limit);
    total = await countAllSearchingInLibraryResults(userId, query);
  }

  return { userBooks, total };
};

export const getUserLibraryBooks = async (
  userId: number,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total;

  if (status && status !== 'all') {
    userBooks = await getUserBooksByStatus(userId, status, offset, limit);
    total = await countUserBooksByStatus(userId, status);
  } else {
    userBooks = await getUserBooks(userId, offset, limit);
    total = await countUserBooks(userId);
  }

  return { userBooks, total };
};

export const findBookInLibrary = async (userIdBookId: UserBookPk) =>
  await prisma.userBook.findUnique({ where: { userId_bookId: userIdBookId } });

export const checkIsBookExist = async (gooleBookId: string) =>
  await prisma.book.findUnique({ where: { googleBookId: gooleBookId } });

export const addBookToLibrary = async (data: Prisma.UserBookUncheckedCreateInput) =>
  await prisma.userBook.create({ data });

export const createAndGetAuthors = async (authors: string[]): Promise<Author[]> => {
  return await prisma
    .$transaction([
      prisma.author.createMany({
        data: authors.map((author) => ({
          name: author,
        })),
        skipDuplicates: true,
      }),

      prisma.author.findMany({
        where: {
          name: {
            in: authors,
          },
        },
      }),
    ])
    .then((results) => results[1]);
};

export const createAndGetCategories = async (categories: string[]): Promise<Category[]> => {
  return await prisma
    .$transaction([
      // Step 1: Create new categories (skip duplicates)
      prisma.category.createMany({
        data: categories.map((category) => ({
          name: category,
        })),
        skipDuplicates: true,
      }),

      // Step 2: Retrieve all categories (existing + newly created)
      prisma.category.findMany({
        where: {
          name: {
            in: categories,
          },
        },
      }),
    ])
    .then((results) => results[1]); // Return only the findMany result
};

export const createBook = async (googleBookData: GoogleBook) => {
  const createdBook = await prisma.book.create({
    include: {
      publisher: true,
      authors: true,
      categories: true,
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

  if (googleBookData.authors) {
    const authors = await createAndGetAuthors(cleanOtherBookData(googleBookData.authors));
    await prisma.bookAuthor.createMany({
      data: authors.map((author) => ({
        bookId: createdBook.id,
        authorId: author.id,
      })),
    });
  }

  if (googleBookData.categories) {
    const categories = await createAndGetCategories(cleanOtherBookData(googleBookData.categories));
    await prisma.bookCategory.createMany({
      data: categories.map((category) => ({
        bookId: createdBook.id,
        categoryId: category.id,
      })),
    });
  }

  return createdBook;
};

export const updateUserBook = async (
  userIdBookId: UserBookPk,
  status: ReadingStatus | undefined,
  rating: number | undefined
): Promise<UserBook> => {
  return await prisma.userBook.update({
    where: {
      userId_bookId: userIdBookId,
    },
    data: {
      status,
      rating,
    },
  });
};

export const deleteUserBook = async (userIdBookId: UserBookPk): Promise<void> => {
  await prisma.userBook.delete({
    where: {
      userId_bookId: userIdBookId,
    },
  });
};
