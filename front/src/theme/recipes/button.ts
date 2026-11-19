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
        h: '44px',
        px: 4,
        borderRadius: 'xl',
        bg: { _light: 'light.200', _dark: 'gray.850' },
        color: { _light: 'brown.800', _dark: 'light.100' },
        fontWeight: '600',
        border: '1px solid',
        borderColor: {
          _light: 'light.400',
          _dark: 'rgba(255,255,255,0.12)',
        },

        _hover: {
          bg: { _light: 'light.300', _dark: 'gray.800' },
        },

        _disabled: {
          opacity: 0.4,
        },
      },
      category: {
        borderRadius: 'full',

        fontWeight: '500',
        bg: { _light: 'ui.surface', _dark: 'ui.accentSoft' },
        borderColor: { _light: 'rgba(61,51,40,0.14)', _dark: 'rgba(224,164,88,0.22)' },
        boxShadow: { _light: '0 1px 2px rgba(61,51,40,0.06)', _dark: 'none' },
        color: 'ui.text',
        border: '1px solid',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        px: 5,
        pl: 2,
        py: 5,
        gap: 2.5,
        '& svg': {
          boxSizing: 'content-box',
          p: '6px',
          w: '16px',
          h: '16px',
          borderRadius: 'full',
          bg: 'ui.accentSoft',
          color: 'ui.accentText',
        },
        _hover: {
          bg: { _light: 'rgba(201,138,46,0.18)', _dark: 'rgba(224,164,88,0.18)' },
          borderColor: { _light: 'rgba(201,138,46,0.55)', _dark: 'rgba(224,164,88,0.5)' },
        },
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
      action: {
        h: '46px',
        px: 3,
        gap: 2.5,
        justifyContent: 'flex-start',
        borderRadius: 'xl',
        bg: { _light: 'light.200', _dark: 'gray.850' },
        border: '1px solid',
        borderColor: {
          _light: 'light.400',
          _dark: 'rgba(255,255,255,0.12)',
        },
        color: { _light: 'brown.800', _dark: 'light.100' },

        '& .action-icon': {
          w: '30px',

          h: '30px',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          borderRadius: 'full',

          bg: { _light: 'light.400', _dark: 'gray.700' },

          color: { _light: 'brown.800', _dark: 'light.100' },

          border: '1px solid',

          borderColor: {
            _light: 'light.500',

            _dark: 'rgba(255,255,255,0.16)',
          },

          flexShrink: 0,
        },

        '& .action-divider': {
          w: '1px',
          h: '20px',
          bg: { _light: 'light.500', _dark: 'rgba(255,255,255,0.16)' },
          flexShrink: 0,
        },
      },
      rating: {
        h: '46px',
        px: 3.5,
        gap: 2,
        borderRadius: 'xl',
        bg: { _light: 'light.200', _dark: 'gray.850' },
        border: '1px solid',
        borderColor: {
          _light: 'light.400',
          _dark: 'rgba(255,255,255,0.12)',
        },
        borderBottomWidth: '2px',
        borderBottomColor: {
          _light: 'light.500',
          _dark: 'rgba(139,115,85,0.55)',
        },
        color: { _light: 'brown.800', _dark: 'light.100' },

        '& svg': {
          fontSize: '18px',

          color: { _light: 'brown.700', _dark: 'brown.300' },

          transition: 'fill 0.15s ease',
        },
      },
    },
    size: {},
  },
  defaultVariants: {
    variant: 'primary',
  },
});
