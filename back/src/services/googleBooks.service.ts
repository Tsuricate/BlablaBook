import axios from 'axios';
import { formatDate } from '../utils/dateFormatter.utils';

const GOOGLE_BOOKS_API_BASE_URL = process.env.GOOGLE_BOOKS_API_BASE_URL as string;

export interface GoogleBook {
  id: string;
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
  imageLinks?: Record<string, string> | {};
  language?: string;
}

// Transforme un volume brut retourné par l'API Google Books en objet GoogleBook
const mapVolumeToBook = (volume: Record<string, unknown>): GoogleBook => {
  const info = (volume.volumeInfo ?? {}) as Record<string, unknown>;
  const identifiers =
    (info.industryIdentifiers as Array<{ type: string; identifier: string }>) ?? [];

  if (!volume.id || typeof volume.id !== 'string') throw new Error('Missing book id');
  if (!info.title || typeof info.title !== 'string') throw new Error('Missing book title');

  return {
    id: volume.id,
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

// Recherche des livres via l'API Google Books à partir d'une requête texte
export const searchBooks = async (
  query: string,
  maxResults = 20,
  startIndex = 0
): Promise<GoogleBook[]> => {
  const response = await axios.get(GOOGLE_BOOKS_API_BASE_URL, {
    params: { q: query, maxResults, startIndex, key: process.env.GOOGLE_BOOKS_API_KEY },
  });

  // items peut être undefined si aucun résultat, on retourne un tableau vide dans ce cas
  const items = (response.data.items ?? []) as Record<string, unknown>[];
  return items.map((item) => mapVolumeToBook(item));
};

// Récupère un livre précis via son identifiant Google Books
export const getBookById = async (googleId: string): Promise<GoogleBook> => {
  const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}/${googleId}`, {
    params: { key: process.env.GOOGLE_BOOKS_API_KEY },
  });

  return mapVolumeToBook(response.data as Record<string, unknown>);
};
