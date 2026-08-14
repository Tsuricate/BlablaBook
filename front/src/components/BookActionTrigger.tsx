import { useTranslation } from 'react-i18next';

import type { Book, LibraryAction } from '../types/book';
import { Button, IconButton, VStack, Text, useBreakpointValue } from '@chakra-ui/react';

import { GoPlusCircle } from 'react-icons/go';
import { TiPlus } from 'react-icons/ti';
import { HiPencil, HiDotsHorizontal } from 'react-icons/hi';
import { SlStar } from 'react-icons/sl';
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

  console.log('rating :', rating);

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
              variant="category"
              width="full"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAction('edit');
              }}
            >
              <HiPencil />
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
    <>
      {mainTrigger}

      {status && !isLibraryMobile && (
        <Button onClick={() => onOpenAction('rate')}>
          <SlStar />
          {rating ? <Text fontWeight="medium">{rating}/5</Text> : t('book:rating.rate')}
        </Button>
      )}
    </>
  );
};

export default BookActionTrigger;
