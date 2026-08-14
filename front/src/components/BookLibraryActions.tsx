import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Drawer, Portal, useBreakpointValue } from '@chakra-ui/react';

import type { Book, LibraryAction, Status } from '../types/book';
import AddBookActions from './AddBookActions';
import EditBookActions from './EditBookActions';
import RateBookActions from './RateBookActions';
import DrawerShell from './DrawerShell';
import { useCurrentUser } from '../context/UserContext';
import BookActionTrigger from './BookActionTrigger';
import DialogShell from './DialogShell';

interface BookLibraryActionsProps {
  book: Book;
  variant?: 'icon' | 'button';
  onStatusChange: (status: Status) => void;
  onRatingChange?: (rating: number) => void;
}

const BookLibraryActions = ({
  book,
  variant = 'button',
  onStatusChange,
  onRatingChange,
}: BookLibraryActionsProps) => {
  const { t } = useTranslation(['book', 'common']);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoggedIn } = useCurrentUser();

  const [actionContent, setActionContent] = useState<LibraryAction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) return null;

  const currentAction = book.status ? 'edit' : 'add';

  const handleOpenAction = (action: LibraryAction) => {
    setIsOpen(true);
    setActionContent(action);
  };

  const handleCloseAction = () => {
    setIsOpen(false);
  };

  const Content = (() => {
    switch (actionContent) {
      case 'add':
        return (
          <AddBookActions
            book={book}
            onStatusChange={onStatusChange}
            onActionChange={setActionContent}
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
            onCloseAction={handleCloseAction}
          />
        );

      default:
        return null;
    }
  })();

  const title =
    actionContent === 'add'
      ? t('book:library.addToLibrary')
      : currentAction === 'edit'
        ? t('book:library.actions.editCollection')
        : t('book:rating.rate');

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
