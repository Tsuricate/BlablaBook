import type { ReactNode } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

type AccountSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  boxed?: boolean;
};

const AccountSection = ({ title, children, action, boxed = false }: AccountSectionProps) => (
  <Box mt={{ base: 8, md: 10 }}>
    <Box borderTopWidth="1px" borderColor="ui.border" pt={5} mt={6}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading fontSize="lg" fontWeight="semibold">
          {title}
        </Heading>
        {action}
      </Flex>

      {boxed ? (
        <Box
          bg="ui.surface"
          borderWidth="1px"
          borderColor="ui.border"
          borderRadius="2xl"
          overflow="hidden"
        >
          {children}
        </Box>
      ) : (
        children
      )}
    </Box>
  </Box>
);

export default AccountSection;
