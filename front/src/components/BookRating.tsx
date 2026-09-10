import { defineSlotRecipe, RatingGroup, useSlotRecipe } from '@chakra-ui/react';
import { ratingGroupAnatomy } from '@chakra-ui/react/anatomy';
import { PiStar, PiStarFill, PiStarHalfFill } from 'react-icons/pi';

type BookRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

const bookRatingRecipe = defineSlotRecipe({
  slots: ratingGroupAnatomy.keys(),
  base: {
    control: { gap: 2 },
    item: {
      color: { _light: 'brown.300', _dark: '#5F5F59' },
      transition: 'transform 0.15s ease',
      _hover: { transform: 'translateY(-2px) scale(1.08)' },
    },
  },
});

const BookRating = ({ value, onChange }: BookRatingProps) => {
  const recipe = useSlotRecipe({ recipe: bookRatingRecipe });
  const styles = recipe();

  return (
    <RatingGroup.Root
      allowHalf
      count={5}
      value={value}
      onValueChange={(event) => onChange(event.value)}
      css={styles.root}
    >
      <RatingGroup.Control css={styles.control}>
        <RatingGroup.Context>
          {({ items }) =>
            items.map((item) => (
              <RatingGroup.Item key={item} index={item} css={styles.item}>
                <RatingGroup.ItemContext>
                  {({ half, highlighted }) => {
                    if (half) {
                      return <PiStarHalfFill size="2.5rem" color="#D8CBBF" />;
                    }

                    return highlighted ? (
                      <PiStarFill size="2.5rem" color="#D8CBBF" />
                    ) : (
                      <PiStar size="2.5rem" color="currentColor" />
                    );
                  }}
                </RatingGroup.ItemContext>
              </RatingGroup.Item>
            ))
          }
        </RatingGroup.Context>

        <RatingGroup.HiddenInput />
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
};

export default BookRating;
