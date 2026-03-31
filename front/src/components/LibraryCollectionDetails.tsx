import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLibrary } from '../context/LibraryContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import { Box } from '@chakra-ui/react';
import BookCardList from './BookCardList';
import { slugify } from '../utils/stringUtils';

const getStatusFromSlug = (slug: string, t: any) => {
  const map: Record<string, string> = {
    [slugify(t('library.collections.read'))]: 'read',
    [slugify(t('library.collections.wishlist'))]: 'wishlist',
  };

  return Object.entries(map).find(([key]) => key === slug)?.[1];
};

const LibraryCollectionDetails = () => {
  const { t, i18n } = useTranslation('book');
  const { collection: slug } = useParams<{ collection: string }>();
  const { getCollection, fetchNextPage } = useLibrary();

  const status = slug ? getStatusFromSlug(slug, t) : undefined;
  const collectionKey = status ? `collections:${status}` : null;
  const collectionBooks = collectionKey ? getCollection(collectionKey) : null;

  useEffect(() => {
    if (!collectionBooks || !collectionKey || !status) return;

    if (collectionBooks.items.length === 0 && collectionBooks.hasNext && !collectionBooks.loading) {
      fetchNextPage(collectionKey, status);
    }
  }, [collectionKey, status, i18n.language]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => {
      if (!collectionKey || !status) return;
      fetchNextPage(collectionKey, status);
    },
    hasNext: collectionBooks?.hasNext ?? false,
    loading: collectionBooks?.loading ?? false,
  });

  if (!collectionBooks) {
    return <p>{t('library.empty')}</p>;
  }

  const isEmpty = collectionBooks.items.length === 0;
  const isInitialLoading = isEmpty && collectionBooks.loading;

  const books = collectionBooks.items.map((item) => item.book);

  if (isInitialLoading) {
    return <BookCardList books={[]} singleColumnMobile isLoading />;
  }

  if (isEmpty) {
    return <p>{t('library.empty')}</p>;
  }

  return (
    <Box w="100%">
      <BookCardList books={books} singleColumnMobile isLoading={false} />
      <div ref={sentinelRef} />
    </Box>
  );
};

export default LibraryCollectionDetails;
