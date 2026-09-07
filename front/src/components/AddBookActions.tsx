import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, VStack, RadioCard, HStack } from '@chakra-ui/react';
import { LuBookCheck } from 'react-icons/lu';
import { CiStar } from 'react-icons/ci';

import type { Book, GoogleBook, LibraryAction, Status } from '../types/book';
import useLibraryActions from '../hooks/useLibraryActions';
import { toaster } from './ui/toaster';

interface AddBookActionsProps {
  book: Book | GoogleBook;
  variant?: 'icon' | 'button';
  onStatusChange?: (status: Status) => void;
  onBookAdded?: (bookId: number) => void;
  onActionChange: (action: LibraryAction) => void;
  onCloseAction: () => void;
}

const getErrorKey = (errorCode?: string) => {
  switch (errorCode) {
    case 'BOOK_ALREADY_IN_LIBRARY':
      return 'book:library.errors.bookAlreadyInLibrary';

    case 'INTERNAL_SERVER_ERROR':
    default:
      return 'book:library.errors.internalServerError';
  }
};

const AddBookActions = ({
  book,
  onStatusChange,
  onBookAdded,
  onActionChange,
  onCloseAction,
}: AddBookActionsProps) => {
  const { t } = useTranslation(['common', 'book']);
  const { addBook } = useLibraryActions();

  const [status, setStatus] = useState<Status | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBookOptions = [
    {
      type: 'wishlist',
      label: t('book:library.collections.wishlist'),
    },
    {
      type: 'read',
      label: t('book:library.collections.read'),
    },
  ] as const;

  const handleAddBook = async (shouldRate = false) => {
    if (isSubmitting || !status) return;

    try {
      setIsSubmitting(true);

      const res = await addBook({
        ...book,
        id: book.googleBookId,
        status,
      });

      if (!res?.success) return;

      toaster.create({
        title: t('book:library.addSuccess', {
          title: book.title,
          status: t(`book:library.collections.${status}`),
        }),
        type: 'success',
      });

      onStatusChange?.(status);
      onBookAdded?.(res.bookId);

      if (shouldRate) {
        onActionChange('rate');
      } else {
        onActionChange('edit');
        onCloseAction();
      }
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;

      toaster.create({
        title: t(getErrorKey(errorCode)),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack gap={4}>
      <RadioCard.Root
        width="full"
        value={status}
        onValueChange={(e) => setStatus(e.value as Status)}
      >
        {addBookOptions.map((option) => (
          <RadioCard.Item
            key={option.type}
            value={option.type}
            fontWeight="semibold"
            borderRadius="xl"
            bg={{ _light: 'light.200', _dark: 'gray.800' }}
            color={{ _light: 'brown.800', _dark: 'light.200' }}
            disabled={isSubmitting}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>{option.label}</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </RadioCard.Root>

      <HStack width="full">
        <Button flex={1} disabled={!status || isSubmitting} onClick={() => handleAddBook()}>
          <LuBookCheck />
          {t('common:save')}
        </Button>

        <Button flex={1} disabled={!status || isSubmitting} onClick={() => handleAddBook(true)}>
          <CiStar />
          {t('book:rating.rate')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default AddBookActions;
