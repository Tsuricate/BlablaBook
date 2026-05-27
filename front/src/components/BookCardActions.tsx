import { Box } from '@chakra-ui/react';

import type { Book } from '../types/book';
import AddBookActions from './AddBookActions';
import EditBookActions from './EditBookActions';

type Mode = 'default' | 'libraryDesktop' | 'libraryMobile';

interface BookCardActionsProps {
  mode: Mode;
  book: Book;
}

const BookCardActions = ({ mode, book }: BookCardActionsProps) => {
  if (mode === 'default') {
    return <AddBookActions book={book} />;
  }

  if (mode === 'libraryDesktop') {
    return (
      <Box position="absolute" top={2} right={2}>
        <EditBookActions book={book} />
      </Box>
    );
  }

  return null;
};

export default BookCardActions;
