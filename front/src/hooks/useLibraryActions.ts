import type { AddBookPayload } from '../types/book';
import { axiosAuth } from '../utils/axiosAuth';
import { useLibrary } from '../context/LibraryContext';

type Status = 'wishlist' | 'read';

const useLibraryActions = () => {
  const { updateBookInCollections, removeBookFromCollections } = useLibrary();

  const addBook = async (book: AddBookPayload) => {
    const res = await axiosAuth.post('/library', {
      book,
      status: book.status ?? 'wishlist',
    });

    return res.data;
  };

  const updateBookStatus = async (
    bookId: string,
    fromKey: string,
    toKey: string,
    status: Status
  ) => {
    const res = await axiosAuth.patch(`/library/${bookId}`, {
      status,
    });

    updateBookInCollections(bookId, fromKey, toKey, status);

    return res.data;
  };

  const removeBook = async (bookId: string, fromKey: string) => {
    try {
      await axiosAuth.delete(`/library/${bookId}`);
      removeBookFromCollections(bookId, fromKey);
    } catch (error) {
      console.error('Delete failed', error);
      throw error;
    }
  };

  return {
    addBook,
    updateBookStatus,
    removeBook,
  };
};

export default useLibraryActions;
