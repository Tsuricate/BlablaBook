import { CloseButton, Dialog, Text } from '@chakra-ui/react';

interface LibraryPopoverShellProps {
  title?: string;
  subtitle?: string;
  width?: string;
  children: React.ReactNode;
}

const DialogShell = ({ title, subtitle, children, width = '300' }: LibraryPopoverShellProps) => {
  return (
    <Dialog.Content
      maxW={width}
      borderRadius="2xl"
      bg={{ _light: 'light.100', _dark: '#20201E' }}
      border="1px solid"
      borderColor={{ _light: 'light.300', _dark: 'rgba(255,255,255,0.08)' }}
      boxShadow={{
        _light: '0 18px 50px rgba(61,51,40,0.12)',
        _dark: '0 18px 50px rgba(0,0,0,0.35)',
      }}
      overflow="hidden"
    >
      <Dialog.Header px={8} pt={8} pb={2}>
        <Dialog.Title
          fontFamily="heading"
          fontSize="2xl"
          fontWeight="medium"
          letterSpacing="tight"
          color={{ _light: 'brown.700', _dark: 'light.200' }}
        >
          {title}
        </Dialog.Title>
      </Dialog.Header>

      {subtitle && (
        <Text px={8} pb={5} fontSize="sm" color={{ _light: 'brown.600', _dark: 'light.400' }}>
          {subtitle}
        </Text>
      )}

      <Dialog.Body px={8} pb={8}>
        {children}
      </Dialog.Body>

      <Dialog.CloseTrigger asChild>
        <CloseButton
          size="sm"
          position="absolute"
          top={5}
          right={5}
          variant="ghost"
          borderRadius="full"
        />
      </Dialog.CloseTrigger>
    </Dialog.Content>
  );
};
export default DialogShell;
