import { Box, Drawer } from '@chakra-ui/react';

interface DrawerShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const DrawerShell = ({ title, subtitle, children }: DrawerShellProps) => (
  <Drawer.Content
    maxW="100%"
    borderTopRadius="2xl"
    bg={{ _light: 'light.100', _dark: '#20201E' }}
    border="1px solid"
    borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.06)' }}
    boxShadow={{
      _light: '0 -18px 50px rgba(61,51,40,0.12)',
      _dark: '0 -18px 50px rgba(0,0,0,0.35)',
    }}
    overflow="hidden"
  >
    <Box
      w="40px"
      h="4px"
      mt={3}
      mb={3}
      mx="auto"
      borderRadius="full"
      bg={{ _light: 'light.400', _dark: 'rgba(255,255,255,0.10)' }}
    />

    <Drawer.Header px={8} pt={3} pb={2}>
      <Drawer.Title
        fontFamily="heading"
        fontSize="2xl"
        fontWeight="medium"
        letterSpacing="tight"
        color={{ _light: 'brown.700', _dark: 'light.200' }}
      >
        {title}
      </Drawer.Title>
    </Drawer.Header>

    {subtitle && (
      <Drawer.Description
        px={8}
        pb={5}
        fontSize="sm"
        color={{ _light: 'brown.600', _dark: 'light.400' }}
      >
        {subtitle}
      </Drawer.Description>
    )}

    <Drawer.Body px={8} pb={8}>
      {children}
    </Drawer.Body>
  </Drawer.Content>
);

export default DrawerShell;
