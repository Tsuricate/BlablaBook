interface UseBookRatingReturn {
  rating: number | null;
  isLoading: boolean;
  updateRating: (rating: number) => Promise<void>;
}
