import { useState } from 'react';
import useLibraryActions from '../hooks/useLibraryActions';
import { Button, HStack, RatingGroup, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/types/book';

type RateBookActionsProps = {
  book: Book;
  onRatingChange?: (rating: number) => void;
  onCloseAction: () => void;
};

const RateBookActions = ({ book, onRatingChange, onCloseAction }: RateBookActionsProps) => {
  const { t } = useTranslation(['common', 'book']);
  const { updateBookRating } = useLibraryActions();

  const [rating, setRating] = useState<number>(book.rating ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingBook = async () => {
    if (isSubmitting || !rating) return;

    try {
      setIsSubmitting(true);
      console.log('passing in RateBookActions !');
      console.log('bookId', book.id, 'userRating :', rating);
      const res = await updateBookRating(book.id, rating);

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
      <Button disabled={!rating} onClick={handleRatingBook}>
        {t('common:save')}
      </Button>
    </Stack>
  );
};

export default RateBookActions;
