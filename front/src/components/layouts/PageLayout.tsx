import React, { type ReactNode } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import Header from '../Header';

type PageLayoutProps = {
  imageSrc: string;
  children: ReactNode;
  header?: ReactNode;
  imagePosition?: 'top' | 'left';
  imageSize?: number;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  imageSrc,
  imagePosition = 'top',
  imageSize = 20,
  children,
}) => {
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
      </Box>

      <Box flex="1" padding={{ base: 4, md: 8 }}>
        {children}
      </Box>
    </Flex>
  );
};
