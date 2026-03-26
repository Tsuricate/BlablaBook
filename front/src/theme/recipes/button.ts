import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'bold',
    borderRadius: 'lg',
    fontFamily: 'var(--chakra-fonts-body)',
    px: 6,
    py: 3,
    transition: 'all 0.2s ease-in-out',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      primary: {
        borderRadius: 'xl',
        bg: { _light: 'light.200', _dark: 'brown.700' },
        color: { _light: 'brown.800', _dark: 'light.100' },
        fontWeight: 'semibold',
        boxShadow: { _light: '0 2px 6px rgba(0,0,0,0.1)', _dark: '0 2px 6px rgba(0,0,0,0.4)' },
        _hover: {
          transform: 'translateY(-2px)',
          bg: { _light: 'light.300', _dark: 'brown.600' },
          boxShadow: { _light: '0 4px 10px rgba(0,0,0,0.15)', _dark: '0 4px 10px rgba(0,0,0,0.5)' },
        },
      },
      category: {
        borderRadius: 'xl',
        bg: { _light: 'brown.400', _dark: 'brown.600' },
        color: { _light: 'light.50', _dark: 'light.100' },
        boxShadow: { _light: '0 1px 2px rgba(122,111,93,0.2)' },
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: { _light: '0 2px 4px rgba(122,111,93,0.25)' },
        },
      },
    },
    size: {},
  },
  defaultVariants: {
    variant: 'primary',
  },
});
