import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';

/**
 * Custom hook to manage book search state and API calls.
 *
 * Features:
 * - Syncs search state with URL query params (`q`).
 * - Fetches search results from the API, supports pagination with "load more".
 * - Provides handlers for search input, submit, load more, and clearing search.
 */
export const useBookSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [activeQuery, setActiveQuery] = useState('');

  // Effect: run on mount & whenever URL query changes
  // - Initializes search value from URL and fetches initial results if a query exists
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    setSearchValue(queryFromUrl);
    setActiveQuery(queryFromUrl);

    if (queryFromUrl) {
      fetchBooks(queryFromUrl, 0, false);
    } else {
      setSearchResults([]);
      setHasMoreResults(true);
      setStartIndex(0);
    }
  }, [searchParams]);

  /**
   * Fetch books from API based on query.
   * @param query - search string
   * @param index - start index for pagination
   * @param setUrl - whether to update URL query params
   */
  const fetchBooks = async (query: string, index = 0, setUrl = false) => {
    if (!query) return;
    const initial = index === 0;
    if (initial) setIsInitialLoading(true);
    else setIsLoading(true);
    try {
      if (setUrl) setSearchParams({ q: query });

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/search`, {
        params: { q: query, startIndex: index },
      });

      if (initial) {
        setSearchResults(data);
        setHasMoreResults(data.length === 20);
      } else {
        // Load more: append results
        setSearchResults((prev) => [...prev, ...data]);
        if (data.length < 20) setHasMoreResults(false);
      }
    } finally {
      if (initial) setIsInitialLoading(false);
      else setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchResults([]);
    setStartIndex(0);
    setHasMoreResults(true);
    setSearchParams({});
  };

  const handleSubmit = () => {
    setActiveQuery(searchValue);
    fetchBooks(searchValue, 0, true);
  };

  const handleLoadMoreBooks = () => fetchBooks(searchValue, startIndex + 20);

  return {
    searchValue,
    searchResults,
    handleSearchChange,
    handleSubmit,
    handleLoadMoreBooks,
    handleClear,
    isLoading,
    isInitialLoading,
    hasMoreResults,
    activeQuery,
  };
};
