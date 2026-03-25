import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'bold',
    borderRadius: 'lg',
    fontFamily: 'var(--chakra-fonts-body)',
  },
  variants: {
    variant: {
      primary: {
        borderRadius: 'lg',
      },
      category: {
        borderRadius: 'xl',
        bg: { _light: 'brown.400', _dark: 'brown.600' },
        color: { _light: 'light.100', _dark: 'light.100' },
        boxShadow: {
          _light: '2px 2px 5px 0px var(--chakra-colors-brown-600)',
        },
        transition: 'all 0.2s ease-in-out',
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: {
            _light: '2px 4px 6px 0px var(--chakra-colors-brown-600)',
          },
        },
      },
    },
    size: {},
  },
  defaultVariants: {
    variant: 'primary',
  },
});
