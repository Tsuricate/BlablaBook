export interface Book {
  id: string;
  bookId?: string;
  googleBookId: string;
  title: string;
  description?: string;
  authors: string[];
  status: Status;
  rating?: number;
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
  status: Status;
  rating: number;
  book: Book;
}

export interface AddBookPayload {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
  categories?: string[];
  status: Status;
}

export type Status = 'wishlist' | 'read';
export type LibraryAction = 'add' | 'edit' | 'rate';
