import { useState } from 'react';
import useLibraryActions from '../hooks/useLibraryActions';
import {
  Button,
  HStack,
  parseDate,
  RatingGroup,
  Stack,
  Text,
  type DateValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/types/book';
import ReadingDateRange from './ReadingDateRange';

type RateBookActionsProps = {
  book: Book;
  onRatingChange?: (rating: number) => void;
  onReadingDatesChange?: (startedAt?: Date, finishedAt?: Date) => void;
  onCloseAction: () => void;
};

const RateBookActions = ({
  book,
  onRatingChange,
  onReadingDatesChange,
  onCloseAction,
}: RateBookActionsProps) => {
  const { t } = useTranslation(['common', 'book']);
  const { updateBookRating } = useLibraryActions();

  const [rating, setRating] = useState<number>(book.rating ?? 0);
  const [readingDateRange, setReadingDateRange] = useState<DateValue[]>([
    ...(book.startedAt ? [parseDate(book.startedAt.toISOString().slice(0, 10))] : []),
    ...(book.finishedAt ? [parseDate(book.finishedAt.toISOString().slice(0, 10))] : []),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [startedAt, finishedAt] = readingDateRange;

  const bookIdToUpdate = book.bookId ?? book.id;

  const handleRatingBook = async () => {
    if (isSubmitting || !bookIdToUpdate) return;

    try {
      setIsSubmitting(true);
      const res = await updateBookRating({
        bookId: bookIdToUpdate,
        rating,
        startedAt: startedAt?.toString(),
        finishedAt: finishedAt?.toString(),
      });

      if (res?.success) {
        onRatingChange?.(rating);
        onReadingDatesChange?.(
          startedAt ? new Date(startedAt.toString()) : undefined,
          finishedAt ? new Date(finishedAt.toString()) : undefined
        );
      }
    } catch (err: any) {
      console.log('Error updating book rating:', err);
    } finally {
      setIsSubmitting(false);
      onCloseAction();
    }
  };

  return (
    <Stack gap={4}>
      <Stack>
        <HStack>
          <RatingGroup.Root
            allowHalf
            colorPalette="yellow"
            count={5}
            value={rating}
            onValueChange={(event) => setRating(event.value)}
            size="lg"
          >
            <RatingGroup.HiddenInput />
            <RatingGroup.Control />
          </RatingGroup.Root>
          {rating > 0 && <Text fontWeight="medium">{rating}/5</Text>}
        </HStack>
      </Stack>
      <ReadingDateRange
        readingDateRange={readingDateRange}
        setReadingDateRange={setReadingDateRange}
      />
      <Button disabled={!rating} onClick={handleRatingBook}>
        {t('common:save')}
      </Button>
    </Stack>
  );
};

export default RateBookActions;
