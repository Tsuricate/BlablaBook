import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLibrary } from '../context/LibraryContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import { Box, Text, HStack } from '@chakra-ui/react';
import BookCardList from './BookCardList';
import { slugify } from '../utils/stringUtils';
import type { Status } from '@/types/book';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const getStatusFromSlug = (slug: string, t: any): Status | undefined => {
  const map: Record<string, Status> = {
    [slugify(t('library.collections.read'))]: 'read',
    [slugify(t('library.collections.wishlist'))]: 'wishlist',
  };

  return Object.entries(map).find(([key]) => key === slug)?.[1];
};

const LibraryCollectionDetails = () => {
  const { t, i18n } = useTranslation('book');
  const { collection: slug } = useParams<{ collection: string }>();
  const { getCollection, fetchNextPage } = useLibrary();
  const navigate = useNavigate();

  const status = slug ? getStatusFromSlug(slug, t) : undefined;
  const collectionKey = status;
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
    return <p>{t('library.emptyCollection')}</p>;
  }

  const isEmpty = collectionBooks.items.length === 0;
  const isInitialLoading = isEmpty && collectionBooks.loading;

  const books = collectionBooks.items.map((item) => item.book);

  const BackToCollections = () => (
    <HStack
      mt={6}
      cursor="pointer"
      onClick={() => navigate('/library/collections')}
      gap={2}
      opacity={0.85}
      _hover={{ opacity: 1 }}
    >
      <MdOutlineArrowBackIosNew />
      <Text>{t('library.actions.backToCollections')}</Text>
    </HStack>
  );

  if (isInitialLoading) {
    return <BookCardList books={[]} singleColumnMobile isLoading />;
  }

  if (isEmpty) {
    return (
      <Box>
        <BackToCollections />
        <Text>{t('library.emptyCollection')}</Text>
      </Box>
    );
  }

  return (
    <Box w="100%">
      <BackToCollections />
      <BookCardList books={books} singleColumnMobile isLoading={false} />
      <div ref={sentinelRef} />
    </Box>
  );
};

export default LibraryCollectionDetails;
