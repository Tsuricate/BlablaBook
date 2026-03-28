import type { UserBook } from '../utils/prisma.utils';

export type AuthorRelation = { author: { name: string } };
export type CategoryRelation = { category: { name: string } };
export type PublisherRelation = { name: string | null };

export type BookWithRelations = {
  id: number;
  title: string;
  averageRating: number | null;
  ratingCount: number | null;
  imageLinks: any | null;
  language: string | null;
  description: string | null;
  publishedDate: string | Date | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  publisherId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  authors: AuthorRelation[] | null;
  publisher: PublisherRelation | null;
  categories: CategoryRelation[] | null;
};

export type UserBookWithDetails = UserBook & {
  book: BookWithRelations;
};

export type UserBookPk = {
  userId: number;
  bookId: number;
};
