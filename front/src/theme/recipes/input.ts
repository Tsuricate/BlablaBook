import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: '2xl',
    fontSize: 'sm',
    fontFamily: 'var(--chakra-fonts-body)',
    color: { _light: 'brown.800', _dark: 'neutral.300' },
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
    _placeholder: {
      color: { _light: 'brown.600', _dark: 'brown.400' },
    },
    bg: { _light: 'light.50', _dark: 'brown.850' },
  },
  variants: {
    variant: {
      primary: {
        bg: { _light: 'light.50', _dark: 'brown.800' },
      },
      searchBar: {
        paddingInline: 6,
        paddingY: 7,
        border: '1px solid',
        borderColor: { _light: '#f8f8f8', _dark: 'rgb(255 255 255 / 10%);' },
        boxShadow: {
          _light:
            'inset 3px 3px 8px rgba(122, 111, 93, 0.18), inset -3px -3px 10px rgba(255, 255, 255, 0.65)',
          _dark: '0 6px 20px rgba(0,0,0,0.5)',
        },
        transition: 'all 0.2s ease',
        _focus: {
          outline: 'none',
          boxShadow: {
            _light:
              'inset 4px 4px 10px rgba(122, 111, 93, 0.22), inset -4px -4px 12px rgba(255, 255, 255, 0.75)',
            _dark: '0 0 0 3px rgba(200,180,150,0.2)',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
