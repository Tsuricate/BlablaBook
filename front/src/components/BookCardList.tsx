import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

interface BookCardListProps {
  title: string;
  books: Book[];
  wrap?: boolean;
  isLoading?: boolean;
}

const BookCardList = ({ title, books, wrap = true, isLoading = false }: BookCardListProps) => {
  const skeletonCount = 6;

  return (
    <Box overflowX={wrap ? 'visible' : 'auto'} mb={6}>
      <Heading size="xl" fontWeight="bold" mb={4}>
        {title}
      </Heading>

      {wrap ? (
        <SimpleGrid minChildWidth={{ base: '140px', md: '150px' }} gap={6}>
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <BookCardSkeleton key={index} wrap={wrap} />
              ))
            : books.map((book) => (
                <Box key={book.id} w={{ base: '150px', md: 'auto' }}>
                  <BookCard book={book} />
                </Box>
              ))}
        </SimpleGrid>
      ) : (
        <Box display="flex" gap={6} py={2}>
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <BookCardSkeleton key={index} wrap={wrap} />
              ))
            : books.map((book) => (
                <Box key={book.id} flex="0 0 auto" w={{ base: '140px', md: '170px' }}>
                  <BookCard book={book} />
                </Box>
              ))}
        </Box>
      )}
    </Box>
  );
};

export default BookCardList;
