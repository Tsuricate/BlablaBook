import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: 'xl',
    fontSize: 'sm',
    fontFamily: 'var(--chakra-fonts-body)',
    color: { _light: 'brown.800', _dark: 'neutral.300' },
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
    _placeholder: {
      color: { _light: 'brown.600', _dark: 'brown.400' },
    },
    _focus: {
      outline: 'none',
      border: {
        _light: '2px solid var(--chakra-colors-brown-600)',
        _dark: '2px solid var(--chakra-colors-brown-400)',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        bg: { _light: 'light.50', _dark: 'brown.800' },
        borderColor: '#3D33281E',
        paddingInlineStart: 4,
        paddingY: 6,
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
