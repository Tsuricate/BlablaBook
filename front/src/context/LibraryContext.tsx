import { createContext, useContext, useState } from 'react';
import type { UserBook } from '../types/book';
import { axiosAuth } from '../utils/axiosAuth';

type PaginatedResponse = {
  pagination: {
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  data: UserBook[];
};

type LibraryCollectionState = {
  items: UserBook[];
  page: number;
  hasNext: boolean;
  loading: boolean;
  total: number;
};

type LibraryContextType = {
  getCollection: (key: string) => LibraryCollectionState;
  fetchNextPage: (key: string, status?: string) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const DEFAULT_COLLECTION_STATE: LibraryCollectionState = {
  items: [],
  page: 0,
  hasNext: true,
  loading: false,
  total: 0,
};

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  // Cache of library data by "collection key".
  // Each key stores its own paginated state (used for infinite scroll)
  const [collections, setCollections] = useState<Record<string, LibraryCollectionState>>({});

  const getCollection = (key: string) => {
    return collections[key] ?? { ...DEFAULT_COLLECTION_STATE };
  };

  const fetchNextPage = async (key: string, status?: string) => {
    const currentState = getCollection(key);
    if (currentState.loading || !currentState.hasNext) return;
    const nextPage = currentState.page + 1;

    //  Loading ON
    setCollections((prev) => ({
      ...prev,
      [key]: { ...currentState, loading: true },
    }));

    try {
      const { data } = await axiosAuth.get<PaginatedResponse>('/api/library', {
        params: { page: nextPage, status },
      });

      setCollections((prev) => {
        const existing = prev[key] || DEFAULT_COLLECTION_STATE;

        const existingIds = new Set(existing.items.map((item) => item.book.id));

        const newItems = data.data.filter((item) => !existingIds.has(item.book.id));

        return {
          ...prev,
          [key]: {
            items: [...existing.items, ...newItems],
            page: nextPage,
            hasNext: data.pagination.hasNext,
            total: data.pagination.total,
            loading: false,
          },
        };
      });
    } catch (error) {
      console.error(error);
      //  Loading OFF
      setCollections((prev) => ({
        ...prev,
        [key]: { ...currentState, loading: false },
      }));
    }
  };

  return (
    <LibraryContext.Provider value={{ getCollection, fetchNextPage }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }

  return context;
};
