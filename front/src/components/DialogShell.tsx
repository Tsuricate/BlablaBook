import { CloseButton, Dialog, Text } from '@chakra-ui/react';

interface LibraryPopoverShellProps {
  title?: string;
  subtitle?: string;
  width?: string;
  children: React.ReactNode;
}

const DialogShell = ({ title, subtitle, children, width = '300' }: LibraryPopoverShellProps) => {
  return (
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title> {title}</Dialog.Title>
      </Dialog.Header>
      <Text>{subtitle}</Text>
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </Dialog.Content>
  );
};
export default DialogShell;
