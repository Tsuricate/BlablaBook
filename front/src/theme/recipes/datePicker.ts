import { defineSlotRecipe } from '@chakra-ui/react';
import { datePickerAnatomy } from '@chakra-ui/react/anatomy';

export const datePickerRecipe = defineSlotRecipe({
  slots: datePickerAnatomy.keys(),

  variants: {
    variant: {
      editorial: {
        root: { maxWidth: '100%' },
        label: {
          mb: 3,
          fontFamily: 'heading',
          fontSize: 'md',
          fontWeight: 'medium',
          color: { _light: 'brown.700', _dark: 'light.300' },
        },
        control: { gap: 2, flex: 1, minW: 0 },
        input: {
          h: '46px',
          px: 4,
          minW: 0,
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: { _light: 'light.300', _dark: 'rgba(255,255,255,0.12)' },
          bg: { _light: 'light.50', _dark: '#282527' },
          color: { _light: 'brown.800', _dark: 'light.100' },
          fontSize: 'sm',
          fontWeight: 'medium',
          _placeholder: {
            color: { _light: 'brown.500', _dark: 'gray.600' },
          },
          _focusVisible: {
            borderColor: { _light: 'brown.300', _dark: 'light.500' },
            boxShadow: 'none',
          },
          _focus: {
            borderColor: { _light: 'brown.300', _dark: 'light.500' },
            boxShadow: 'none',
          },
        },
        trigger: {
          h: '46px',
          w: '46px',
          flexShrink: 0,
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: { _light: 'light.300', _dark: 'rgba(255,255,255,0.12)' },
          bg: { _light: 'light.200', _dark: '#282825' },
          color: { _light: 'brown.700', _dark: 'light.200' },
          _hover: {
            bg: { _light: 'light.300', _dark: '#30302D' },
          },
          _focusVisible: { boxShadow: 'none' },
        },
        content: {
          borderRadius: '2xl',
          border: '1px solid',
          borderColor: { _light: 'light.300', _dark: 'rgba(255,255,255,0.08)' },
          bg: { _light: 'light.100', _dark: '#282825' },
          boxShadow: {
            _light: '0 18px 50px rgba(61,51,40,0.12)',
            _dark: '0 18px 50px rgba(0,0,0,0.35)',
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'editorial',
  },
});
