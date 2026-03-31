import { Menu, Portal } from '@chakra-ui/react';
import { HiDotsHorizontal } from 'react-icons/hi';

const BookDotsMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <HiDotsHorizontal />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="modify">Modifier</Menu.Item>
            <Menu.Item value="remove">Retirer</Menu.Item>
            <Menu.Item value="details">Voir détails</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default BookDotsMenu;
