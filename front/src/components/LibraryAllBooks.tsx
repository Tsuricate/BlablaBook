import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import BookCardList from './BookCardList';
import { useLibrary } from '../context/LibraryContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const LibraryAllBooks = () => {
  const { t } = useTranslation('book');
  const { getCollection, fetchNextPage } = useLibrary();
  const collectionBooks = getCollection('all');

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => fetchNextPage('all'),
    hasNext: collectionBooks.hasNext,
    loading: collectionBooks.loading,
  });

  const books = collectionBooks.items.map((collectionBooks) => collectionBooks.book);

  useEffect(() => {
    fetchNextPage('all');
  }, []);

  return (
    <Box w="100%">
      {collectionBooks.items.length === 0 && !collectionBooks.loading ? (
        <p>{t('library.empty')}</p>
      ) : (
        <>
          <BookCardList
            books={books}
            singleColumnMobile
            isLoading={collectionBooks.items.length === 0 && collectionBooks.loading}
          />
          <div ref={sentinelRef} />
        </>
      )}
    </Box>
  );
};

export default LibraryAllBooks;
