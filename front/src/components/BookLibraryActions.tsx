import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Drawer, Portal, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

import type { Book, GoogleBook, LibraryAction, Status } from '../types/book';
import AddBookActions from './AddBookActions';
import EditBookActions from './EditBookActions';
import RateBookActions from './RateBookActions';
import DrawerShell from './DrawerShell';
import { useCurrentUser } from '../context/UserContext';
import BookActionTrigger from './BookActionTrigger';
import DialogShell from './DialogShell';
import { useNavigate } from 'react-router';

interface BookLibraryActionsProps {
  book: Book | GoogleBook;
  variant?: 'icon' | 'button';
  onBookAdded?: (bookId: number) => void;
  onStatusChange: (status: Status) => void;
  onRatingChange?: (rating: number) => void;
  onReadingDatesChange?: (startedAt?: Date, finishedAt?: Date) => void;
}

const BookLibraryActions = ({
  book,
  variant = 'button',
  onBookAdded,
  onStatusChange,
  onRatingChange,
  onReadingDatesChange,
}: BookLibraryActionsProps) => {
  const { t } = useTranslation(['book', 'common']);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoggedIn } = useCurrentUser();
  const navigate = useNavigate();

  const [actionContent, setActionContent] = useState<LibraryAction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentAction = book.status ? 'edit' : 'add';

  const handleOpenAction = (action: LibraryAction) => {
    setIsOpen(true);
    setActionContent(action);
  };

  const handleCloseAction = () => {
    setIsOpen(false);
  };

  const Content = (() => {
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
    switch (actionContent) {
      case 'add':
        return (
          <AddBookActions
            book={book}
            onBookAdded={onBookAdded}
            onStatusChange={onStatusChange}
            onActionChange={handleOpenAction}
            onCloseAction={handleCloseAction}
          />
        );

      case 'edit':
        return (
          <EditBookActions
            book={book}
            onStatusChange={onStatusChange}
            onActionChange={setActionContent}
            onCloseAction={handleCloseAction}
          />
        );

      case 'rate':
        return (
          <RateBookActions
            book={book}
            onRatingChange={onRatingChange}
            onReadingDatesChange={onReadingDatesChange}
            onCloseAction={handleCloseAction}
          />
        );

      default:
        return null;
    }
  })();

  const getActionTitle = (action: LibraryAction | null) => {
    switch (action) {
      case 'add':
        return t('book:library.addToLibrary');
      case 'edit':
        return t('book:library.actions.editCollection');
      case 'rate':
        return t('book:rating.rate');
      default:
        return '';
    }
  };

  const title = getActionTitle(actionContent);

  if (isMobile) {
    return (
      <>
        <BookActionTrigger
          variant={variant}
          currentAction={currentAction}
          book={book}
          onOpenAction={handleOpenAction}
        />

        <Drawer.Root
          placement="bottom"
          open={isOpen}
          onOpenChange={(event) => {
            if (!event.open) handleCloseAction();
          }}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <DrawerShell title={title}>{Content}</DrawerShell>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </>
    );
  }

  return (
    <>
      <BookActionTrigger
        variant={variant}
        currentAction={currentAction}
        book={book}
        onOpenAction={handleOpenAction}
      />

      <Dialog.Root
        open={isOpen}
        onOpenChange={(event) => {
          if (!event.open) handleCloseAction();
        }}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <DialogShell title={title}>{Content}</DialogShell>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default BookLibraryActions;
