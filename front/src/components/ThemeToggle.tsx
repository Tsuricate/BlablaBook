import { ColorModeButton } from '../components/ui/color-mode';

type ThemeToggleProps = {
  onImage?: boolean;
};

const ThemeToggle = ({ onImage = true }: ThemeToggleProps) => {
  return (
    <ColorModeButton
      size="md"
      rounded="full"
      variant="ghost"
      color={onImage ? 'white' : 'ui.text'}
      bg={onImage ? 'blackAlpha.300' : 'transparent'}
      backdropFilter={onImage ? 'blur(8px)' : undefined}
      _hover={{ bg: onImage ? 'blackAlpha.400' : 'ui.raised' }}
      transition="background-color 0.2s ease"
    />
  );
};

export default ThemeToggle;
