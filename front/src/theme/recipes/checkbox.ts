import { defineSlotRecipe } from '@chakra-ui/react';

export const checkboxRecipe = defineSlotRecipe({
  slots: ['root', 'control', 'label'],
  variants: {
    variant: {
      solid: {
        control: {
          borderRadius: 'md',
          borderColor: { _light: 'rgba(61,51,40,0.35)', _dark: 'rgba(255,255,255,0.25)' },
          _checked: {
            bg: 'ui.accent',
            borderColor: 'ui.accent',
            color: { _light: 'white', _dark: '#1A1612' },
          },
        },
      },
    },
  },
});
