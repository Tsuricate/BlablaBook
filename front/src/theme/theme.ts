import { createSystem, defaultConfig, defineConfig, defineTokens } from '@chakra-ui/react';
import { inputRecipe, buttonRecipe } from './recipes';

const fonts = defineTokens.fonts({
  heading: { value: 'Lora' },
  body: { value: 'Inter' },
});

const colors = defineTokens.colors({
  light: {
    50: { value: '#FEFDFB' },
    100: { value: '#F5F0EB' },
    200: { value: '#E8DFD6' },
  },
  brown: {
    200: { value: '#E8D5C4' },
    300: { value: '#D9AE94' },
    400: { value: '#B8A997' },
    600: { value: '#7A6F5D' },
    700: { value: '#8B7355' },
    800: { value: '#3D3328' },
    900: { value: '#1A1612' },
  },

  gray: {
    50: { value: '#FFFFFF' },
    200: { value: '#3D4655' },
    300: { value: '#5D6E7D' },
    400: { value: '#4A5568' },
    500: { value: '#7D8B7A' },
  },
});

const config = defineConfig({
  globalCss: {
    html: { minHeight: '100%' },
    '#root': { minHeight: '100%' },
    body: {
      minHeight: '100%',
      margin: 0,
      bg: { _light: 'light.100', _dark: 'brown.900' },
      color: { _light: 'brown.800', _dark: 'light.200' },
    },
  },
  theme: {
    tokens: {
      colors,
      fonts,
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
