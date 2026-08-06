import { useState } from 'react';
import { RatingGroup, Stack, Text, HStack, Drawer, Portal, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import DrawerShell from './DrawerShell';
// import { axiosAuth } from '../utils/axiosAuth';

export interface BookRatingProps {
  open: boolean;
  onOpenChange: Drawer.RootProps['onOpenChange'];
  bookId?: string;
}

const BookRating = ({ open, onOpenChange, bookId }: BookRatingProps) => {
  const { t } = useTranslation(['book', 'common']);
  const [userRating, setUserRating] = useState(0);

  const handleSaveRating = async () => {
    try {
      console.log('userRating :', userRating);
      // const res = await axiosAuth.post('/');
    } catch (error) {}
  };

  return (
    <>
      <Drawer.Root placement="bottom" open={open} onOpenChange={onOpenChange}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <DrawerShell
              title={t('book:rating.rateBook')}
              children={
                <Stack gap={4}>
                  <Stack>
                    <HStack>
                      <RatingGroup.Root
                        allowHalf
                        colorPalette="yellow"
                        count={5}
                        value={userRating}
                        onValueChange={(event) => setUserRating(event.value)}
                        defaultValue={userRating}
                        size="lg"
                      >
                        <RatingGroup.HiddenInput />
                        <RatingGroup.Control />
                      </RatingGroup.Root>
                      {userRating > 0 && <Text fontWeight="medium">{userRating}/5</Text>}
                    </HStack>
                  </Stack>
                  <Button onClick={handleSaveRating}>{t('common:save')}</Button>
                </Stack>
              }
            />
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      {/* )} */}
    </>
  );
};

export default BookRating;
