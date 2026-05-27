import { Box, Popover } from '@chakra-ui/react';

interface LibraryPopoverShellProps {
  title?: string;
  subtitle?: string;
  width?: string;
  children: React.ReactNode;
}

const LibraryPopoverShell = ({
  title,
  subtitle,
  children,
  width = '300',
}: LibraryPopoverShellProps) => (
  <Popover.Content
    width={width}
    bg={{ _light: 'light.50', _dark: 'gray.900' }}
    borderWidth="1px"
    borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.10)' }}
    borderRadius="2xl"
    boxShadow={{
      _light: '0 16px 40px rgba(0,0,0,0.12)',
      _dark: '0 16px 40px rgba(0,0,0,1)',
    }}
  >
    {title && (
      <Box px={4} pt={4} pb={3}>
        <Box
          fontWeight="semibold"
          fontSize="md"
          fontFamily="heading"
          color={{ _dark: 'light.100' }}
        >
          {title}
        </Box>

        {subtitle && (
          <Box fontSize="sm" mt={1} color={{ _light: 'brown.600', _dark: 'light.500' }}>
            {subtitle}
          </Box>
        )}
      </Box>
    )}

    <Box px={4} pb={4}>
      {children}
    </Box>
  </Popover.Content>
);

export default LibraryPopoverShell;
