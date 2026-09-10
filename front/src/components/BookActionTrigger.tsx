import { useTranslation } from 'react-i18next';

import type { Book, LibraryAction } from '../types/book';
import { Button, IconButton, Box, Text, useBreakpointValue, Stack, VStack } from '@chakra-ui/react';

import { GoPlusCircle } from 'react-icons/go';
import { TiPlus } from 'react-icons/ti';
import { LuBookCheck, LuStar } from 'react-icons/lu';
import { FaStar } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { HiOutlineBookmark } from 'react-icons/hi2';
import { useLocation } from 'react-router';

interface BookActionTriggerProps {
  variant?: 'icon' | 'button';
  currentAction: LibraryAction;
  book: Book;
  onOpenAction: (action: LibraryAction) => void;
}

const BookActionTrigger = ({
  currentAction,
  variant = 'button',
  book,
  onOpenAction,
}: BookActionTriggerProps) => {
  const { t } = useTranslation(['book', 'common']);
  const { pathname } = useLocation();
  const { status, rating } = book;
  const isLibraryPage = pathname.startsWith('/library');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isLibraryMobile = isLibraryPage && isMobile;

  const mainTrigger = (() => {
    switch (currentAction) {
      case 'add':
        return variant === 'button' ? (
          <Button
            alignSelf="start"
            variant="category"
            width="full"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAction('add');
            }}
          >
            <GoPlusCircle />
            {t('book:library.addBookToLibrary')}
          </Button>
        ) : (
          <IconButton
            aria-label={t('bookCard.addBook')}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            variant="glass"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAction('add');
            }}
          >
            <TiPlus />
          </IconButton>
        );

      case 'edit':
        return variant === 'button' ? (
          <VStack align="start">
            <Button
              variant="action"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAction('edit');
              }}
            >
              <Box className="action-icon">
                {status === 'wishlist' ? <HiOutlineBookmark /> : <LuBookCheck />}
              </Box>
              <Box className="action-divider" />
              <Text fontSize="sm">{t(`book:library.collections.${status}`)}</Text>
            </Button>
          </VStack>
        ) : (
          <IconButton
            aria-label={t('bookCard.editBook')}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            variant="glass"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAction('edit');
            }}
          >
            <HiDotsHorizontal />
          </IconButton>
        );

      default:
        return null;
    }
  })();

  return (
    <Stack direction="row" align="center" gap={2} width="full">
      {mainTrigger}

      {status && !isLibraryMobile && (
        <Button variant="rating" onClick={() => onOpenAction('rate')}>
          {rating ? <FaStar /> : <LuStar />}

          <Text>{rating ? `${rating}/5` : t('book:rating.rate')}</Text>
        </Button>
      )}
    </Stack>
  );
};

export default BookActionTrigger;
