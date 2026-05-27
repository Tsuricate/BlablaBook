import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Drawer,
  IconButton,
  Popover,
  Portal,
  useBreakpointValue,
  VStack,
  Text,
} from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import { GoPlusCircle } from 'react-icons/go';

import type { Book, Status } from '../types/book';
import useLibraryActions from '../hooks/useLibraryActions';
import { toaster } from './ui/toaster';
import LibraryPopoverShell from './LibraryPopoverShell';
import LibraryDrawerShell from './LibraryDrawerShell';
import { useCurrentUser } from '../context/UserContext';
import { useNavigate } from 'react-router';

interface AddBookActionsProps {
  book: Book;
  variant?: 'icon' | 'button';
  onStatusChange?: (status: Status) => void;
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

const AddBookActions = ({ book, variant = 'icon', onStatusChange }: AddBookActionsProps) => {
  const { t } = useTranslation(['common', 'book']);
  const { addBook } = useLibraryActions();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn } = useCurrentUser();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const addBookOptions = [
    { type: 'wishlist', label: t('book:library.collections.wishlist') },
    { type: 'read', label: t('book:library.collections.read') },
  ] as const;

  const handleAddBook = async (status: 'wishlist' | 'read') => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await addBook({ ...book, id: book.googleBookId, status });

      if (res?.success) {
        toaster.create({
          title: t('book:library.addSuccess', {
            title: book.title,
            status: t(`book:library.collections.${status}`),
          }),
          type: 'success',
        });
        onStatusChange?.(status);
      }

      setIsOpen(false);
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      toaster.create({
        title: t(getErrorKey(errorCode)),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const renderButtonVariant = () => {
    if (!isLoggedIn) {
      return (
        <Button
          alignSelf="start"
          variant="plain"
          paddingLeft={0}
          color={{ _light: 'brown.800', _dark: 'light.200' }}
          bg={{ _light: 'light.100', _dark: 'brown.900' }}
          _hover={{ textDecoration: 'underline' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <GoPlusCircle />
          {t('book:library.addBookToLibrary')}
        </Button>
      );
    }

    if (!book?.status) {
      return (
        <VStack align="start">
          <Text fontSize="sm">{t('book:library.addBookCTA')}</Text>

          <Button
            variant="plain"
            paddingLeft={0}
            color={{ _light: 'brown.800', _dark: 'light.200' }}
            bg={{ _light: 'light.100', _dark: 'brown.900' }}
            _hover={{ textDecoration: 'underline' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <GoPlusCircle />
            {t('book:library.addBookAction')}
          </Button>
        </VStack>
      );
    }
  };

  const Content = () => {
    if (!isLoggedIn) {
      return (
        <VStack gap={4} align="stretch">
          <Text fontSize="sm" color={{ _light: 'brown.600', _dark: 'light.400' }}>
            {t('book:library.loginRequired')}
          </Text>

          <Button w="100%" onClick={() => navigate('/login')}>
            {t('common:nav.login')}
          </Button>
        </VStack>
      );
    }

    return (
      <VStack gap={4}>
        {addBookOptions.map((option) => (
          <Button
            key={option.type}
            w="100%"
            py={6}
            px={5}
            borderRadius="xl"
            justifyContent="flex-start"
            fontWeight="semibold"
            fontSize="md"
            bg={{ _light: 'light.200', _dark: 'gray.800' }}
            color={{ _light: 'brown.800', _dark: 'light.200' }}
            onClick={() => handleAddBook(option.type)}
            disabled={isSubmitting}
          >
            {option.label}
          </Button>
        ))}
      </VStack>
    );
  };

  const Trigger =
    variant === 'button' ? (
      renderButtonVariant()
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
          setIsOpen(true);
        }}
      >
        <TiPlus />
      </IconButton>
    );

  if (isMobile) {
    return (
      <>
        {Trigger}
        <Drawer.Root placement="bottom" open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <LibraryDrawerShell
                title={isLoggedIn ? t('book:library.addToLibrary') : t('book:library.addBook')}
                subtitle={isLoggedIn ? t('book:library.chooseCollection') : undefined}
                children={<Content />}
              />
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </>
    );
  }

  return (
    <Popover.Root
      open={isOpen}
      positioning={{ placement: 'right-start' }}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Popover.Trigger asChild>{Trigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <LibraryPopoverShell
            title={isLoggedIn ? t('book:library.addToLibrary') : t('book:library.addBook')}
            subtitle={isLoggedIn ? t('book:library.chooseCollection') : undefined}
            children={<Content />}
          />
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default AddBookActions;
