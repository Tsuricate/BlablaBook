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
        bg: 'ui.surface',
        color: 'ui.text',
        paddingInline: 6,
        paddingY: 7,
        border: '1px solid',
        borderColor: 'ui.border',
        boxShadow: { _light: '0 1px 2px rgba(0,0,0,0.04)', _dark: 'none' },
        _placeholder: { color: 'ui.muted' },
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        _focus: {
          outline: 'none',
          borderColor: { _light: 'rgba(201,138,46,0.6)', _dark: 'rgba(224,164,88,0.6)' },
          boxShadow: {
            _light: '0 0 0 3px rgba(201,138,46,0.15)',
            _dark: '0 0 0 3px rgba(224,164,88,0.15)',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
