import { useState } from 'react';
import useLibraryActions from '../hooks/useLibraryActions';
import { Button, parseDate, Stack, Text, type DateValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/types/book';
import ReadingDateRange from './ReadingDateRange';
import BookRating from './BookRating';

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
    <Stack gap={8}>
      <Stack
        align="center"
        gap={4}
        py={8}
        borderRadius="3xl"
        bg={{ _light: 'light.50', _dark: '#282825' }}
      >
        <Text
          fontFamily="heading"
          fontSize="md"
          fontWeight="medium"
          letterSpacing="wide"
          color={{ _light: 'brown.700', _dark: '#E8DFD6' }}
        >
          {rating ? t('book:rating.myRating') : t('book:rating.rateBook')}
        </Text>

        <BookRating value={rating} onChange={(value) => setRating(value)} />

        <Text
          fontSize="lg"
          fontWeight="bold"
          fontFamily="heading"
          color={{ _light: 'brown.700', _dark: '#F2EDE4' }}
        >
          {rating > 0 ? `${rating} / 5` : '—'}
        </Text>
      </Stack>

      <Stack
        gap={5}
        pt={7}
        borderTop="1px solid"
        borderColor={{ _light: 'brown.200', _dark: 'rgba(255,255,255,0.08)' }}
      >
        <ReadingDateRange
          readingDateRange={readingDateRange}
          setReadingDateRange={setReadingDateRange}
        />
      </Stack>

      <Button variant="primary" disabled={!rating} onClick={handleRatingBook}>
        <Text>{t('common:save')}</Text>
      </Button>
    </Stack>
  );
};

export default RateBookActions;
