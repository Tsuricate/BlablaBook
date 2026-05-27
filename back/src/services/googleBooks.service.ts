import axios from 'axios';
import { formatDate } from '../utils/dateFormatter.utils';

const GOOGLE_BOOKS_API_BASE_URL = process.env.GOOGLE_BOOKS_API_BASE_URL as string;

interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface GoogleBook {
  id: string;
  googleBookId: string;
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: Date | null;
  description?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingCount?: number;
  imageLinks?: ImageLinks;
  language?: string;
}

const mapVolumeToBook = (volume: Record<string, unknown>): GoogleBook => {
  const info = (volume.volumeInfo ?? {}) as Record<string, unknown>;
  const identifiers =
    (info.industryIdentifiers as Array<{ type: string; identifier: string }>) ?? [];

  if (!volume.id || typeof volume.id !== 'string') throw new Error('Missing book id');
  if (!info.title || typeof info.title !== 'string') throw new Error('Missing book title');

  return {
    id: volume.id,
    googleBookId: volume.id,
    title: info.title,
    authors: info.authors as string[] | undefined,
    publisher: info.publisher as string | undefined,
    publishedDate: typeof info.publishedDate === 'string' ? formatDate(info.publishedDate) : null,
    description: info.description as string | undefined,
    isbn10: identifiers.find((i) => i.type === 'ISBN_10')?.identifier,
    isbn13: identifiers.find((i) => i.type === 'ISBN_13')?.identifier,
    pageCount: info.pageCount as number | undefined,
    categories: info.categories as string[] | undefined,
    averageRating: info.averageRating as number | undefined,
    ratingCount: info.ratingCount as number | undefined,
    imageLinks: info.imageLinks ?? {},
    language: info.language as string | undefined,
  };
};

export const searchBooks = async (
  query: string,
  maxResults = 20,
  startIndex = 0,
  language = 'fr'
): Promise<GoogleBook[]> => {
  const fetchBooks = async () => {
    const response = await axios.get(GOOGLE_BOOKS_API_BASE_URL, {
      params: {
        q: query,
        maxResults,
        startIndex,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        printType: 'books',
        orderBy: 'relevance',
        langRestrict: language,
      },
    });

    const items = (response.data.items ?? []) as Record<string, unknown>[];
    return items.map((item) => mapVolumeToBook(item));
  };

  const MAX_RETRIES = 2;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      return await fetchBooks();
    } catch (err: any) {
      attempt++;

      const is503 = err.response?.status === 503;

      if (is503 && attempt < MAX_RETRIES) {
        console.log(`Retrying Google Books API... attempt ${attempt}`);

        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));

        continue;
      }

      console.log('Google Books failed, returning empty array');
      return [];
    }
  }

  return [];
};

export const getBookById = async (googleId: string): Promise<GoogleBook> => {
  const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}/${googleId}`, {
    params: { key: process.env.GOOGLE_BOOKS_API_KEY },
  });

  return mapVolumeToBook(response.data as Record<string, unknown>);
};
