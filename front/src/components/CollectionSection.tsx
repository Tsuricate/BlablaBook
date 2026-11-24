import { Box, Flex, Heading } from '@chakra-ui/react';
import BookCard from './BookCard';
import ScrollRow from './ScrollRow';
import type { GoogleBook } from '../types/book';
import { getCollectionTheme } from '../utils/themeUtils';

type CollectionSectionProps = {
  themeKey: string;
  title: string;
  books: GoogleBook[];
  index: number;
};

const CollectionSection = ({ themeKey, title, books, index }: CollectionSectionProps) => {
  const { color, accent } = getCollectionTheme(themeKey);
  const sideTitle = index % 2 === 1;

  return (
    <Box
      bg={{
        _light: `color-mix(in srgb, ${color} 10%, #EFE6D6)`,
        _dark: `color-mix(in srgb, ${color} 14%, #1C1C1A)`,
      }}
      borderWidth="1px"
      borderColor="ui.border"
      borderRadius="2xl"
      p={{ base: 5, md: 8 }}
      overflow="hidden"
    >
      <Flex
        direction={{ base: 'column', lg: sideTitle ? 'row' : 'column' }}
        align={{ base: 'stretch', lg: sideTitle ? 'center' : 'stretch' }}
        gap={{ base: 4, lg: sideTitle ? 10 : 4 }}
      >
        <Box flexShrink={0} w={{ lg: sideTitle ? '260px' : 'auto' }}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="semibold"
            letterSpacing="-0.02em"
          >
            {title}
          </Heading>
          <Box mt={3} w="48px" h="3px" borderRadius="full" style={{ background: accent }} />
        </Box>

        <Box flex="1" minW={0}>
          <ScrollRow>
            {books.map((book) => (
              <Box key={book.id} flexShrink={0} w={{ base: '150px', md: '200px' }}>
                <BookCard book={book} />
              </Box>
            ))}
          </ScrollRow>
        </Box>
      </Flex>
    </Box>
  );
};

export default CollectionSection;
