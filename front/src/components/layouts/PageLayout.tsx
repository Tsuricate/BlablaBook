import React, { type ReactNode } from 'react';
import { Box, Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import Header from '../Header';

type PageLayoutProps = {
  imageSrc: string;
  children: ReactNode;
  header?: ReactNode;
  imagePosition?: 'top' | 'left';
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  imageSrc,
  imagePosition = 'top',
  children,
}) => {
  const imageSize = useBreakpointValue({ base: 25, md: 32 });
  const flexDirection = { base: 'column', md: imagePosition === 'left' ? 'row' : 'column' };
  const imageHeight = `${imageSize}vh`;
  const imageWidth = `${imageSize}vw`;

  return (
    <Flex direction={flexDirection} width="100%" position="relative">
      <Box position="absolute" top={0} right={0} width="100%" padding={4} zIndex={9999}>
        <Header />
      </Box>

      <Box
        flexShrink={0}
        width={{ base: '100%', md: imagePosition === 'left' ? imageWidth : '100%' }}
        height={{
          base: imageHeight,
          md: imagePosition === 'left' ? '100vh' : imageHeight,
        }}
        position="relative"
      >
        <Image src={imageSrc} alt="Page image" objectFit="cover" width="100%" height="100%" />
        <Box position="absolute" inset={0} bg="blackAlpha.500" pointerEvents="none" />
      </Box>

      <Box
        flex="1"
        mt={{ base: '-24px', md: imagePosition === 'top' ? '-32px' : 0 }}
        ml={{ md: imagePosition === 'left' ? '-32px' : 0 }}
        borderColor={{
          _light: 'brown.400',
          _dark: 'rgb(239 239 239 / 14%)',
        }}
        borderTopWidth={{ base: '1px', md: imagePosition === 'top' ? '1px' : 0 }}
        borderTopLeftRadius="3xl"
        borderTopRightRadius={{ base: '3xl', md: imagePosition === 'top' ? '3xl' : 0 }}
        borderLeftWidth={{ base: 0, md: imagePosition === 'left' ? '1px' : '0' }}
        borderBottomLeftRadius={{ base: 0, md: imagePosition === 'left' ? '3xl' : 0 }}
        paddingX={{ base: 5, md: 10 }}
        paddingY={{ base: 5, md: 8 }}
        bg={{ _light: 'light.100', _dark: 'brown.900' }}
        zIndex={1}
      >
        {children}
      </Box>
    </Flex>
  );
};
