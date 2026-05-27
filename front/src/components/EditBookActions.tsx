import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Popover,
  Portal,
  useBreakpointValue,
  VStack,
  Text,
} from '@chakra-ui/react';
import { HiDotsHorizontal, HiCheck, HiPencil, HiTrash } from 'react-icons/hi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Book } from '../types/book';
import LibraryPopoverShell from './LibraryPopoverShell';
import LibraryDrawerShell from './LibraryDrawerShell';
import useLibraryActions from '../hooks/useLibraryActions';
import { toaster } from './ui/toaster';

type Status = 'wishlist' | 'read';
type Mode = 'menu' | 'edit' | 'delete' | null;

interface EditBookActionsProps {
  book: Book;
  variant?: 'icon' | 'button';
  onStatusChange?: (status: Status) => void;
}

const EditBookActions = ({ book, variant = 'icon', onStatusChange }: EditBookActionsProps) => {
  const { t } = useTranslation(['book', 'common']);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { updateBookStatus, removeBook } = useLibraryActions();

  const [mode, setMode] = useState<Mode>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMenuOpen = mode === 'menu';
  const isEditOpen = mode === 'edit';
  const isDeleteOpen = mode === 'delete';

  const options: { type: Status; label: string }[] = [
    { type: 'wishlist', label: t('book:library.collections.wishlist') },
    { type: 'read', label: t('book:library.collections.read') },
  ];

  const closeAll = () => setMode(null);

  const handleUpdateStatus = async (status: Status) => {
    try {
      await updateBookStatus(book.id, book.status, status, status);

      onStatusChange?.(status);
      closeAll();
    } catch (err) {
      console.error('Failed to update book status', err);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await removeBook(book.id, book.status);

      toaster.create({
        title: t('library.deleteSuccess'),
        type: 'success',
      });

      closeAll();
    } catch (err) {
      toaster.create({
        title: t('library.deleteError'),
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const Content = (
    <VStack gap={4}>
      {options.map((opt) => {
        const isActive = book.status === opt.type;

        return (
          <Button
            key={opt.type}
            w="100%"
            py={6}
            px={5}
            variant="libraryAction"
            color={{ _light: 'brown.800', _dark: 'light.200' }}
            borderWidth="2px"
            boxShadow={isActive ? 'sm' : 'none'}
            opacity={isActive ? 0.5 : 1}
            cursor={isActive ? 'not-allowed' : 'pointer'}
            _hover={{
              borderColor: isActive ? undefined : 'brown.300',
              opacity: isActive ? 0.7 : 0.9,
              transform: isActive ? 'none' : 'translateY(-1px)',
            }}
            onClick={() => {
              if (!isActive) handleUpdateStatus(opt.type);
            }}
          >
            <HStack justify="space-between" w="100%">
              <span>{opt.label}</span>
              {isActive && <HiCheck />}
            </HStack>
          </Button>
        );
      })}
    </VStack>
  );

  const DeleteContent = (
    <VStack gap={4} p={2}>
      <HStack w="100%" gap={3}>
        <Button
          flex={1}
          justifyContent="center"
          variant="libraryAction"
          onClick={closeAll}
          disabled={isDeleting}
        >
          {t('common:cancel')}
        </Button>

        <Button
          flex={1}
          color="red.400"
          justifyContent="center"
          variant="libraryAction"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {t('common:delete')}
        </Button>
      </HStack>
    </VStack>
  );

  const Trigger =
    variant === 'button' ? (
      <VStack align="start">
        <Text fontSize="sm">
          {t('book:library.alreadyInCollection', {
            collection: t(`book:library.collections.${book.status}`),
          })}
        </Text>
        <Button
          variant="plain"
          pl={0}
          color={{ _light: 'brown.800', _dark: 'light.200' }}
          bg={{ _light: 'light.100', _dark: 'brown.900' }}
          _hover={{ textDecoration: 'underline' }}
          onClick={(e) => {
            e.stopPropagation();
            setMode('edit');
          }}
        >
          <HiPencil />
          {t('book:library.actions.changeCollection')}
        </Button>
      </VStack>
    ) : (
      <IconButton
        aria-label={t('bookCard.editBook')}
        size="xs"
        variant="glass"
        onClick={(e) => {
          e.stopPropagation();
          setMode('menu');
        }}
      >
        <HiDotsHorizontal />
      </IconButton>
    );

  return (
    <>
      <Popover.Root
        open={isMenuOpen}
        onOpenChange={(e) => {
          if (!e.open) closeAll();
        }}
        positioning={{ placement: 'right-start' }}
        size="xs"
      >
        <Popover.Trigger asChild>{Trigger}</Popover.Trigger>

        <Portal>
          <Popover.Positioner>
            <LibraryPopoverShell
              width="200px"
              children={
                <VStack gap={3} pt={4}>
                  <Button variant="libraryAction" onClick={() => setMode('edit')}>
                    <HiPencil />
                    {t('library.actions.edit')}
                  </Button>

                  <Button
                    variant="libraryAction"
                    color="red.400"
                    disabled={isDeleting}
                    onClick={() => setMode('delete')}
                  >
                    <HiTrash />
                    {t('library.actions.delete')}
                  </Button>
                </VStack>
              }
            />
          </Popover.Positioner>
        </Portal>
      </Popover.Root>

      {isEditOpen &&
        (isMobile ? (
          <Drawer.Root open placement="bottom" onOpenChange={(e) => !e.open && closeAll()}>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <LibraryDrawerShell
                  title={t('library.actions.editCollection')}
                  children={Content}
                />
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        ) : (
          <Popover.Root
            open
            onOpenChange={(e) => !e.open && closeAll()}
            positioning={{ placement: 'right' }}
          >
            <Popover.Trigger asChild>
              <Box />
            </Popover.Trigger>

            <Portal>
              <Popover.Positioner>
                <LibraryPopoverShell
                  title={t('library.actions.editCollection')}
                  children={Content}
                />
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        ))}

      {isDeleteOpen &&
        (isMobile ? (
          <Drawer.Root open placement="bottom" onOpenChange={(e) => !e.open && closeAll()}>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <LibraryDrawerShell
                  title={t('library.deleteConfirm.title')}
                  subtitle={t('library.deleteConfirm.subtitle', {
                    title: book.title,
                  })}
                >
                  {DeleteContent}
                </LibraryDrawerShell>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        ) : (
          <Popover.Root
            open
            onOpenChange={(e) => !e.open && closeAll()}
            positioning={{ placement: 'right' }}
          >
            <Popover.Trigger asChild>
              <Box />
            </Popover.Trigger>

            <Portal>
              <Popover.Positioner>
                <LibraryPopoverShell
                  title={t('library.deleteConfirm.title')}
                  subtitle={t('library.deleteConfirm.subtitle', {
                    title: book.title,
                  })}
                >
                  {DeleteContent}
                </LibraryPopoverShell>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        ))}
    </>
  );
};

export default EditBookActions;
