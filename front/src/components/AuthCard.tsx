import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  subtitle?: string;
  onSubmit: (event: React.SyntheticEvent) => void;
  footer?: ReactNode;
  children: ReactNode;
};

const cardStyle = {
  bg: 'ui.surface',
  borderWidth: '1px',
  borderColor: 'ui.border',
  borderRadius: '2xl',
} as const;

const AuthCard = ({ title, subtitle, onSubmit, footer, children }: AuthCardProps) => (
  <Flex
    justify="center"
    px={{ base: 0, md: 4 }}
    pt={{ base: 2, md: 'clamp(96px, 14vh, 220px)' }}
    pb={{ base: 20, md: 12 }}
  >
    <Box
      as="form"
      onSubmit={onSubmit}
      width="100%"
      maxW={{ base: '460px', md: '520px', lg: '580px', xl: '640px', '2xl': '700px' }}
      p={{ base: 0, md: 8, lg: 10, xl: 12 }}
      bg={{ base: 'transparent', md: cardStyle.bg }}
      borderWidth={{ base: 0, md: cardStyle.borderWidth }}
      borderColor={cardStyle.borderColor}
      borderRadius={{ base: 0, md: cardStyle.borderRadius }}
      boxShadow={{ md: '0 8px 30px rgba(0,0,0,0.06)' }}
    >
      <Box mb={6} px={{ base: 1, md: 0 }}>
        <Heading
          fontSize={{ base: '3xl', md: '3xl', xl: '4xl' }}
          fontWeight="semibold"
          letterSpacing="-0.02em"
        >
          {title}
        </Heading>
        {subtitle && (
          <Text mt={1} fontSize={{ base: 'sm', xl: 'md' }} color="ui.muted">
            {subtitle}
          </Text>
        )}
      </Box>

      <Box
        p={{ base: 5, md: 0 }}
        {...cardStyle}
        bg={{ base: 'ui.surface', md: 'transparent' }}
        borderWidth={{ base: '1px', md: 0 }}
        boxShadow={{ base: '0 4px 16px rgba(0,0,0,0.05)', md: 'none' }}
      >
        {children}

        {footer && (
          <Box
            mt={6}
            textAlign="center"
            fontSize="sm"
            color="ui.muted"
            css={{
              '& a': {
                color: 'var(--chakra-colors-ui-accent-text)',
                fontWeight: 600,
                textDecoration: 'underline',
              },
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Box>
  </Flex>
);

export default AuthCard;
