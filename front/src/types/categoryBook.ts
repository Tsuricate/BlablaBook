export interface CategoryBook {
  id: string;
  title: string;
  imageLinks: string | null;
  averageRating: number | null;
  publishedDate: string | null;
  authors: string[];
}

export interface CategoryBooksResponse {
  category: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  books: CategoryBook[];
}
