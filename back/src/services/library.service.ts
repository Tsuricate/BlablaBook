import { prisma, type ReadingStatus } from '../utils/prisma.utils';
import { UserBookWithDetails } from '../types/userBook.types';

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
        imageLinks,
        // Extract author names from the nested author relationship
        authors: bookData.authors?.map((author) => author.author.name) || [],
        // Extract publisher name from the nested publisher relationship
        publisher: bookData.publisher?.name || null,
        // Extract category names from the nested category relationship
        categories: bookData.categories?.map((category) => category.category.name) || [],
      },
    };
  });
};

/**
 * Retrieves a paginated list of all books associated with a specific user.
 * Includes detailed book information with authors, publisher, and categories.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param offset - Pagination offset (number of items to skip)
 * @param limit - Maximum number of books to return
 * @returns Promise resolving to array of user books with detailed book information
 */
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

/**
 * Retrieves a paginated list of books associated with a specific user, filtered by reading status.
 * Includes detailed book information with authors, publisher, and categories.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param status - Reading status to filter by ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param offset - Pagination offset (number of items to skip)
 * @param limit - Maximum number of books to return
 * @returns Promise resolving to array of user books with detailed book information
 */
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

/**
 * Counts the number of books in a user's library filtered by reading status.
 * Used for pagination total count when filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param status - Reading status to filter by
 * @returns Promise resolving to the count of matching books
 */
const countUserBooksByStatus = async (userId: number, status: string | 'all' | undefined) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
      status: status as ReadingStatus,
    },
  });
};

/**
 * Counts the total number of books in a user's library.
 * Used for pagination total count when not filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @returns Promise resolving to the total count of books
 */
const countUserBooks = async (userId: number) => {
  return await prisma.userBook.count({
    where: {
      userId: userId,
    },
  });
};

/**
 * Searches for user books with optional query filtering and pagination.
 * Searches across book title, description, author names, publisher name, and categories.
 *
 * @param userId - ID of the user whose books to search
 * @param query - Optional search term (case-insensitive)
 * @param offset - Pagination offset
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of user books with detailed book information
 */
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
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
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
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
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

/**
 * Searches for user books filtered by reading status with optional query filtering and pagination.
 * Similar to searchUserBooks but adds status filtering.
 *
 * @param userId - ID of the user whose books to search
 * @param query - Optional search term (case-insensitive)
 * @param status - Reading status to filter by ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param offset - Pagination offset
 * @param limit - Maximum number of results to return
 * @returns Promise resolving to array of user books with detailed book information
 */
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
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
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
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
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

/**
 * Counts the number of user books matching search criteria filtered by reading status.
 * Used for pagination total count when filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param query - Optional search term (case-insensitive)
 * @param status - Reading status to filter by
 * @returns Promise resolving to the count of matching books
 */
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
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
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
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
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

/**
 * Counts the number of all user books matching search criteria (without status filtering).
 * Used for pagination total count when not filtering by status.
 *
 * @param userId - ID of the user whose books to count
 * @param query - Optional search term (case-insensitive)
 * @returns Promise resolving to the count of matching books
 */
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
          // Search in publisher name
          {
            publisher: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          // Search in category names
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
          // Search in book title
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          // Search in book description
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

/**
 * Main function to retrieve user books with optional filtering, search, and pagination.
 * Orchestrates the search and counting operations based on whether status filtering is applied.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param query - Optional search term (case-insensitive)
 * @param status - Optional reading status filter ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param limit - Maximum number of results per page
 * @param offset - Pagination offset
 * @returns Promise resolving to object containing userBooks array and total count
 */
export const getUserBooksByQuery = async (
  userId: number,
  query: string | undefined,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total; // the total count of books

  // Query the database for books associated with the user with pagination
  if (status && status !== 'all') {
    // When filtering by specific status, use status-specific search and count functions
    userBooks = await searchInUserBooksByStatus(userId, query, status, offset, limit);
    total = await countSearchingInLibraryResultsByStatus(userId, query, status);
  } else {
    // When no status filter or 'all' status, use general search and count functions
    userBooks = await searchInUserBooks(userId, query, offset, limit);
    total = await countAllSearchingInLibraryResults(userId, query);
  }

  return { userBooks, total };
};

/**
 * Main function to retrieve user books with optional status filtering and pagination.
 * Orchestrates the retrieval and counting operations based on whether status filtering is applied.
 *
 * @param userId - ID of the user whose books to retrieve
 * @param status - Optional reading status filter ('READ', 'READING', 'WANT_TO_READ', etc.)
 * @param limit - Maximum number of results per page
 * @param offset - Pagination offset
 * @returns Promise resolving to object containing userBooks array and total count
 */
export const getUserLibraryBooks = async (
  userId: number,
  status: string | 'all' | undefined,
  limit: number,
  offset: number
) => {
  let userBooks;
  let total; // the total count of books

  // Query the database for books associated with the user with pagination
  if (status && status !== 'all') {
    // When filtering by specific status, use status-specific search and count functions
    userBooks = await getUserBooksByStatus(userId, status, offset, limit);
    total = await countUserBooksByStatus(userId, status);
  } else {
    // When no status filter or 'all' status, use general search and count functions
    userBooks = await getUserBooks(userId, offset, limit);
    total = await countUserBooks(userId);
  }

  return { userBooks, total };
};
