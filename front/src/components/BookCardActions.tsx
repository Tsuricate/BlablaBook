import { Box, IconButton } from '@chakra-ui/react';
import { TiPlus } from 'react-icons/ti';
import BookDotsMenu from './BookDotsMenu';
import { useTranslation } from 'react-i18next';

type Mode = 'default' | 'libraryDesktop' | 'libraryMobile';

interface BookCardActionsProps {
  mode: Mode;
}

const BookCardActions = ({ mode }: BookCardActionsProps) => {
  const { t } = useTranslation('common');
  if (mode === 'default') {
    return (
      <IconButton
        aria-label={t('bookCard.addBook')}
        size="xs"
        position="absolute"
        top={2}
        right={2}
        variant="glass"
      >
        <TiPlus />
      </IconButton>
    );
  }

  if (mode === 'libraryDesktop') {
    return (
      <Box
        position="absolute"
        top={2}
        right={2}
        bg={{ _light: 'rgba(255,255,255,0.75)', _dark: 'rgba(0,0,0,0.55)' }}
        backdropFilter="blur(12px)"
        borderRadius="full"
        px={1}
        py={1}
        borderWidth="1px"
        borderColor={{ _light: 'rgba(0,0,0,0.10)', _dark: 'rgba(255,255,255,0.10)' }}
        boxShadow={{ _light: '0 4px 10px rgba(0,0,0,0.08)', _dark: 'none' }}
      >
        <BookDotsMenu />
      </Box>
    );
  }

  return null;
};

export default BookCardActions;
