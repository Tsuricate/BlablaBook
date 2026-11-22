import { Flex, Text } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';

type AccountSettingRowProps = {
  label: string;
  value: string;
  onClick: () => void;
  last?: boolean;
};

const AccountSettingRow = ({ label, value, onClick, last = false }: AccountSettingRowProps) => (
  <Flex
    as="button"
    w="100%"
    align="center"
    justify="space-between"
    gap={4}
    px={{ base: 4, md: 5 }}
    py={4}
    textAlign="left"
    cursor="pointer"
    borderBottomWidth={last ? 0 : '1px'}
    borderColor="ui.border"
    transition="background-color 0.2s ease"
    _hover={{ bg: 'ui.raised' }}
    onClick={onClick}
  >
    <Text fontWeight="medium">{label}</Text>

    <Flex align="center" gap={2} color="ui.muted" minW={0}>
      <Text fontSize="sm" truncate>
        {value}
      </Text>
      <LuChevronRight />
    </Flex>
  </Flex>
);

export default AccountSettingRow;
