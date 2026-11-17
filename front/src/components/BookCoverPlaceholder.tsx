import { Box, Text } from '@chakra-ui/react';
import { getPaletteIndex, palette } from '../utils/bookUtils';

type BookCoverPlaceholderProps = {
  title: string;
  onClick?: () => void;
};

export const BookCoverPlaceholder = ({ title, onClick }: BookCoverPlaceholderProps) => {
  const [light, dark] = palette[getPaletteIndex(title)];

  return (
    <Box
      onClick={onClick}
      position="relative"
      w="100%"
      h="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      pl="16%"
      pr="6%"
      py="5"
      textAlign="center"
      color="white"
      borderRadius="md"
      style={{ backgroundImage: `linear-gradient(160deg, ${light}, ${dark})` }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        w="10%"
        pointerEvents="none"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05) 70%, rgba(0,0,0,0))',
          borderRight: '1px solid rgba(255,255,255,0.15)',
        }}
      />

      <Box
        position="absolute"
        top="8px"
        right="8px"
        bottom="8px"
        left="14%"
        pointerEvents="none"
        borderRadius="sm"
        style={{ border: '1px solid rgba(255,255,255,0.35)' }}
      />

      <Box
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        pointerEvents="none"
        borderRadius="md"
        style={{
          backgroundImage:
            'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)',
        }}
      />

      <Text fontWeight="bold" lineClamp={4}>
        {title}
      </Text>
    </Box>
  );
};
