import { Box, Image, IconButton, VStack, Heading } from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import { useNavigate } from 'react-router';
import { slugify } from '../utils/stringUtils';
import noBookCover from '../assets/noBookCover.jpg';
import { useTranslation } from 'react-i18next';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { title, averageRating, imageLinks, categories } = book;

  const firstCategory = categories?.[0] ?? 'uncategorized';
  const slugCategory = slugify(firstCategory);

  const handleClick = () => {
    navigate(`/books/${slugCategory}/${book.id}`);
  };

  return (
    <VStack role="group" gap={3} align="start" cursor="pointer" onClick={handleClick} h="100%">
      <Box
        position="relative"
        w="100%"
        h={{ base: '220px', md: '260px' }}
        borderRadius="xl"
        overflow="hidden"
        bg="gray.50"
        borderWidth="1px"
        borderColor="gray.100"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        }}
      >
        <Image
          src={imageLinks?.thumbnail || noBookCover}
          alt={title}
          objectFit="fill"
          w="100%"
          h="100%"
          transition="transform 0.3s ease"
          _groupHover={{ transform: 'scale(1.05)' }}
        />

        {averageRating !== undefined && (
          <Box
            position="absolute"
            top={2}
            left={2}
            bg="whiteAlpha.900"
            color="blackAlpha.800"
            backdropFilter="blur(6px)"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="medium"
          >
            ⭐ {averageRating}
          </Box>
        )}

        <IconButton
          aria-label={t('bookCard.addBook')}
          size="xs"
          position="absolute"
          top={2}
          right={2}
          variant="ghost"
          bg="whiteAlpha.800"
          backdropFilter="blur(6px)"
        >
          <TiPlus color="black" />
        </IconButton>
      </Box>

      <Heading size="sm" fontWeight="medium" lineClamp={2}>
        {title}
      </Heading>
    </VStack>
  );
};

export default BookCard;
