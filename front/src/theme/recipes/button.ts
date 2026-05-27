import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'bold',
    borderRadius: 'lg',
    fontFamily: 'var(--chakra-fonts-body)',
    px: 6,
    py: 3,
    cursor: 'pointer',
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
        bg: { _light: 'light.800', _dark: 'brown.700' },
        color: { _light: 'light.50', _dark: 'light.100' },
        fontWeight: 'semibold',
        boxShadow: { _light: '0 2px 6px rgba(0,0,0,0.1)', _dark: '0 2px 6px rgba(0,0,0,0.4)' },
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: { _light: '0 4px 10px rgba(0,0,0,0.15)', _dark: '0 4px 10px rgba(0,0,0,0.5)' },
        },
      },
      category: {
        borderRadius: 'xl',
        px: 6,
        py: 5,
        color: { _light: 'light.50', _dark: 'light.100' },
        bg: { _light: 'light.600', _dark: 'gray.850' },
        backgroundImage: {
          _light: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.03))',
          _dark: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18))',
        },
        border: '1px solid',
        borderColor: { _light: 'rgba(255,255,255,0.22)', _dark: 'rgba(255,255,255,0.08)' },
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'xs',
        },
        transition: 'all 0.2s ease',
      },
      glass: {
        borderRadius: 'full',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
        bg: { _light: 'rgba(255,255,255,0.78)', _dark: 'rgba(0,0,0,0.55)' },
        color: { _light: 'black', _dark: 'white' },
        borderColor: { _light: 'rgba(0,0,0,0.10)', _dark: 'rgba(255,255,255,0.10)' },
        boxShadow: { _light: '0 4px 10px rgba(0,0,0,0.10)', _dark: 'none' },
        _hover: {
          bg: { _light: 'rgba(255,255,255,0.9)', _dark: 'rgba(0,0,0,0.65)' },
          boxShadow: { _light: '0 6px 14px rgba(0,0,0,0.14)', _dark: 'none' },
        },
      },
      libraryAction: {
        bg: { base: 'light.200', _dark: 'gray.800' },
        borderRadius: 'xl',
        fontWeight: 'semibold',
        textAlign: 'center',
        fontSize: 'md',
        minW: '150px',
        justifyContent: 'flex-start',
        py: 6,
        px: 5,
        _hover: {
          opacity: 0.9,
        },
      },
    },
    size: {},
  },
  defaultVariants: {
    variant: 'primary',
  },
});
