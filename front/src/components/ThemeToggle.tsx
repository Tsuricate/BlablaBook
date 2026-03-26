import { ColorModeButton } from '../components/ui/color-mode';

const ThemeToggle = () => {
  return (
    <ColorModeButton
      size="md"
      rounded="full"
      variant="ghost"
      bg={{ _light: 'light.100', _dark: 'brown.800' }}
      color={{ _light: 'neutral.900', _dark: 'light.50' }}
      _hover={{
        transform: 'rotate(20deg) scale(1.1)',
        bg: { _light: 'light.200', _dark: 'neutral.700' },
      }}
      transition="all 0.3s ease"
    />
  );
};

export default ThemeToggle;
