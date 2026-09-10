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
