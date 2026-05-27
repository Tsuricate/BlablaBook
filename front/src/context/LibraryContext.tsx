import { createContext, useContext, useState } from 'react';
import type { Status, UserBook } from '../types/book';
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
  fetchFirstPage: (key: string, status?: string) => Promise<void>;
  fetchNextPage: (key: string, status?: string) => Promise<void>;
  updateBookInCollections: (
    bookId: string,
    fromKey: string,
    toKey: string,
    newStatus: Status
  ) => void;
  removeBookFromCollections: (bookId: string, fromKey: string) => void;
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

  const fetchFirstPage = async (key: string, status?: string) => {
    setCollections((prev) => ({
      ...prev,
      [key]: { ...DEFAULT_COLLECTION_STATE, loading: true },
    }));

    try {
      const { data } = await axiosAuth.get<PaginatedResponse>('/api/library', {
        params: { page: 1, status },
      });

      setCollections((prev) => ({
        ...prev,
        [key]: {
          items: data.data,
          page: 1,
          hasNext: data.pagination.hasNext,
          total: data.pagination.total,
          loading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setCollections((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_COLLECTION_STATE, loading: false },
      }));
    }
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

  const updateBookInCollections = (
    bookId: string,
    fromKey: string,
    toKey: string,
    newStatus: Status
  ) => {
    setCollections((prev) => {
      const from = prev[fromKey] ?? DEFAULT_COLLECTION_STATE;
      const to = prev[toKey] ?? DEFAULT_COLLECTION_STATE;
      const all = prev['all'] ?? DEFAULT_COLLECTION_STATE;

      const bookEntryToMove = from.items.find(
        (collectionEntry) => collectionEntry.book.id === bookId
      );

      if (!bookEntryToMove) return prev;

      const updatedBookEntry: UserBook = {
        ...bookEntryToMove,
        status: newStatus,
        book: {
          ...bookEntryToMove.book,
          status: newStatus,
        },
      };

      return {
        ...prev,

        [fromKey]: {
          ...from,
          items: from.items.filter((collectionEntry) => collectionEntry.book.id !== bookId),
        },

        [toKey]: {
          ...to,
          items: [updatedBookEntry, ...to.items],
        },

        all: {
          ...all,
          items: all.items.map((collectionEntry) =>
            collectionEntry.book.id === bookId ? updatedBookEntry : collectionEntry
          ),
        },
      };
    });
  };

  const removeBookFromCollections = (bookId: string, fromKey: string) => {
    setCollections((prev) => {
      const from = prev[fromKey] ?? DEFAULT_COLLECTION_STATE;
      const all = prev.all ?? DEFAULT_COLLECTION_STATE;

      return {
        ...prev,

        [fromKey]: {
          ...from,
          items: from.items.filter((collectionEntry) => collectionEntry.book.id !== bookId),
          total: Math.max(0, from.total - 1),
        },

        all: {
          ...all,
          items: all.items.filter((collectionEntry) => collectionEntry.book.id !== bookId),
          total: Math.max(0, all.total - 1),
        },
      };
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        getCollection,
        fetchFirstPage,
        fetchNextPage,
        updateBookInCollections,
        removeBookFromCollections,
      }}
    >
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
