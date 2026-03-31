import { Box, Heading, Separator, SimpleGrid } from '@chakra-ui/react';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import type { Book } from '../types/book';

interface BookCardListProps {
  title?: string;
  books: Book[];
  wrap?: boolean;
  isLoading?: boolean;
  singleColumnMobile?: boolean;
}

const BookCardList = ({
  title,
  books,
  wrap = true,
  isLoading = false,
  singleColumnMobile = false,
}: BookCardListProps) => {
  const skeletonCount = 6;

  const minChildWidth = { base: singleColumnMobile ? '100%' : '140px', md: '150px' };
  const boxWidth = { base: singleColumnMobile ? '100%' : '150px', md: 'auto' };

  const renderSkeletons = () =>
    Array.from({ length: skeletonCount }).map((_, index) => (
      <BookCardSkeleton key={index} wrap={wrap} />
    ));

  const renderBooks = () =>
    books.map((book) => (
      <Box key={book.id} w={boxWidth}>
        {singleColumnMobile && <Separator display={{ base: 'block', md: 'none' }} my={4} />}
        <BookCard book={book} />
      </Box>
    ));

  const content = isLoading ? renderSkeletons() : renderBooks();

  return (
    <Box overflowX={wrap ? 'visible' : 'auto'}>
      {title && (
        <Box mb={4}>
          <Heading
            size="lg"
            fontWeight="semibold"
            letterSpacing="-0.02em"
            color={{ _light: 'brown.800', _dark: 'light.100' }}
          >
            {title}
          </Heading>

          <Box
            mt={1}
            w="70px"
            h="2px"
            bg={{ _light: 'rgba(168,143,117,0.25)', _dark: 'rgba(255,255,255,0.08)' }}
          />
        </Box>
      )}

      <Box
        overflowX={wrap ? 'visible' : 'auto'}
        css={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        pt={{ md: 1 }}
      >
        {wrap ? (
          <SimpleGrid minChildWidth={minChildWidth} gap={6}>
            {content}
          </SimpleGrid>
        ) : (
          <Box display="flex" gap={6} pb={{ base: 1, md: 4 }} pl={1} scrollBehavior="smooth">
            {content}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BookCardList;
