import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: 'xl',
    fontSize: 'sm',
    fontFamily: 'var(--chakra-fonts-body)',
    color: 'ui.text',
    bg: 'ui.page',
    border: '1px solid',
    borderColor: { _light: 'rgba(61,51,40,0.18)', _dark: 'rgba(255,255,255,0.10)' },
    boxShadow: 'none',
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
    _disabled: { opacity: 0.7, cursor: 'not-allowed' },
  },
  variants: {
    variant: {
      primary: {},
      searchBar: {
        bg: 'ui.surface',
        paddingInline: 6,
        paddingY: 7,
        borderColor: 'ui.border',
        boxShadow: { _light: '0 1px 2px rgba(0,0,0,0.04)', _dark: 'none' },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
