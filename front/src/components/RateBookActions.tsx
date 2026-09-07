import { useState } from 'react';
import useLibraryActions from '../hooks/useLibraryActions';
import { Button, HStack, RatingGroup, Stack, Text, type DateValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/types/book';
import ReadingDateRange from './ReadingDateRange';

type RateBookActionsProps = {
  book: Book;
  onRatingChange?: (rating: number) => void;
  onCloseAction: () => void;
};

const RateBookActions = ({ book, onRatingChange, onCloseAction }: RateBookActionsProps) => {
  const { t } = useTranslation(['common', 'book']);
  const { updateBookRating } = useLibraryActions();

  const [rating, setRating] = useState<number>(book.rating ?? 0);
  const [readingDateRange, setReadingDateRange] = useState<DateValue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [startedAt, finishedAt] = readingDateRange;

  const handleRatingBook = async () => {
    if (isSubmitting || !book.bookId) return;

    try {
      setIsSubmitting(true);
      const res = await updateBookRating({
        bookId: book.bookId,
        rating,
        startedAt: startedAt?.toString(),
        finishedAt: finishedAt?.toString(),
      });

      if (res?.success) onRatingChange?.(rating);
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
