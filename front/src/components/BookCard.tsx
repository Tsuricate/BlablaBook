import {
  Box,
  Text,
  Image,
  IconButton,
  Heading,
  Flex,
  Show,
  useBreakpointValue,
} from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import { useNavigate, useLocation } from 'react-router';
import { slugify } from '../utils/stringUtils';
import noBookCover from '../assets/noBookCover.jpg';
import { useTranslation } from 'react-i18next';
import type { Book } from '../types/book';

import BookDotsMenu from './BookDotsMenu';
import BookCardActions from './BookCardActions';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');

  const { title, authors, averageRating, imageLinks, categories } = book;

  const firstCategory = categories?.[0] ?? 'uncategorized';
  const slugCategory = slugify(firstCategory);

  const isLibraryPage = pathname.startsWith('/library');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const mode = isLibraryPage ? (isMobile ? 'libraryMobile' : 'libraryDesktop') : 'default';

  const handleClick = () => {
    navigate(`/books/${slugCategory}/${book.id}`);
  };

  return (
    <Flex
      role="group"
      position="relative"
      direction={isLibraryPage ? { base: 'row', md: 'column' } : 'column'}
      gapX={6}
      gapY={3}
      align={{ base: 'center', md: 'start' }}
      minW={{ base: '140px', md: '160px' }}
      cursor="pointer"
      transition="transform 0.25s ease"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Box
        position="relative"
        h={{ base: '220px', md: '260px' }}
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor={{ _light: 'rgba(0,0,0,0.08)', _dark: 'rgba(255,255,255,0.08)' }}
        boxShadow={{
          _light: '0 10px 22px rgba(0,0,0,0.10)',
          _dark: '0 10px 22px rgba(0,0,0,0.40)',
        }}
        transition="box-shadow 0.25s ease"
        _hover={{
          boxShadow: {
            _light: '0 10px 20px rgba(0,0,0,0.16)',
            _dark: '0 10px 20px rgba(0,0,0,0.50)',
          },
        }}
      >
        <Image
          src={imageLinks?.thumbnail || noBookCover}
          alt={title}
          objectFit="cover"
          w="100%"
          h="100%"
          onClick={handleClick}
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          pointerEvents="none"
          backgroundImage={{
            _light: 'linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(0,0,0,0.12) 100%)',
            _dark: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {averageRating !== undefined && (
          <Box
            position="absolute"
            top={2}
            left={2}
            bg={{ _light: 'rgba(255,255,255,0.88)', _dark: 'rgba(0,0,0,0.60)' }}
            color={{ _light: 'black', _dark: 'white' }}
            backdropFilter="blur(8px)"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="semibold"
            borderWidth="1px"
            borderColor={{ _light: 'rgba(0,0,0,0.06)', _dark: 'rgba(255,255,255,0.10)' }}
          >
            ⭐ {averageRating}
          </Box>
        )}

        <BookCardActions mode={mode} />

        {!isLibraryPage && (
          <IconButton
            aria-label={t('bookCard.addBook')}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            variant="glass"
          >
            <TiPlus />
          </IconButton>
        )}
      </Box>

      <Box textAlign="left" position="relative" flex="1">
        <Heading size={{ base: 'md', md: 'sm' }} fontWeight="medium" lineClamp={2}>
          {title}
        </Heading>

        <Show when={isLibraryPage}>
          <Text fontSize={{ base: 'md', md: 'sm' }} opacity={0.75}>
            {authors?.join(', ')}
          </Text>
        </Show>
      </Box>
      {isLibraryPage && isMobile && (
        <Box position="absolute" top={0} right={0}>
          <BookDotsMenu />
        </Box>
      )}
    </Flex>
  );
};

export default BookCard;
