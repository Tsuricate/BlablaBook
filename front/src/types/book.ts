export interface Book {
  id: string;
  title: string;
  description?: string;
  authors: string[];
  averageRating?: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  categories?: string[];
  language?: string;
  pageCount?: number;
  publisher?: string;
  isbn13?: string;
  isbn10?: string;
}

export interface UserBook {
  userId: number;
  bookId: number;
  status: string;
  book: Book;
}
