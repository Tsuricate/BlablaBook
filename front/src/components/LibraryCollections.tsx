import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLibrary } from '../context/LibraryContext';

import { useColorModeValue } from './ui/color-mode';
import { Box, HStack, Stack, Circle, Heading } from '@chakra-ui/react';
import { slugify } from '../utils/stringUtils';

const LibraryCollections = () => {
  const cardBg = useColorModeValue('light.200', 'gray.800');
  const cardHover = useColorModeValue('light.300', 'brown.800');
  const textColor = useColorModeValue('brown.900', 'light.50');
  const circleBg = useColorModeValue('brown.400', 'brown.600');
  const circleTextColor = useColorModeValue('light.50', 'light.50');

  const navigate = useNavigate();
  const { t } = useTranslation('book');
  const { getCollection, fetchFirstPage } = useLibrary();

  const collections = [
    {
      key: 'read',
      collectionKey: 'read',
      status: 'read',
    },
    {
      key: 'wishlist',
      collectionKey: 'wishlist',
      status: 'wishlist',
    },
  ];

  useEffect(() => {
    fetchFirstPage('read', 'read');
    fetchFirstPage('wishlist', 'wishlist');
  }, []);

  return (
    <Stack gap={6} p={4}>
      {collections.map(({ key, collectionKey }) => {
        const label = t(`library.collections.${key}`);
        const slug = slugify(label);

        const collectionBooks = getCollection(collectionKey);
        const count = collectionBooks.total;

        return (
          <Box
            key={key}
            onClick={() => navigate(`/library/collections/${slug}`)}
            bg={cardBg}
            _hover={{ bg: cardHover, cursor: 'pointer' }}
            borderRadius="xl"
            p={6}
            shadow="md"
            transition="background 0.2s"
          >
            <HStack justifyContent="space-between">
              <Heading fontSize="xl" fontWeight="bold" color={textColor}>
                {t(`library.collections.${key}`)}
              </Heading>
              <Circle size="40px" bg={circleBg} color={circleTextColor} fontWeight="bold">
                {count}
              </Circle>
            </HStack>
          </Box>
        );
      })}
    </Stack>
  );
};

export default LibraryCollections;
