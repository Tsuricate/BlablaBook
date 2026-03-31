import { createSystem, defaultConfig, defineConfig, defineTokens } from '@chakra-ui/react';
import { inputRecipe, buttonRecipe } from './recipes';

const fonts = defineTokens.fonts({
  heading: { value: 'Lora' },
  body: { value: 'Inter' },
});

const colors = defineTokens.colors({
  light: {
    50: { value: '#FEFDFB' },
    100: { value: '#F2EDE4' },
    200: { value: '#E8DFD6' },
    300: { value: '#E2D6C8' },
    400: { value: '#D8CBBF' },
    500: { value: '#CFBFAF' },
    600: { value: '#C6B59F' },
    700: { value: '#BDA891' },
    800: { value: '#B39C83' },
    900: { value: '#A88F75' },
  },
  brown: {
    200: { value: '#E8D5C4' },
    300: { value: '#D6BCA6' },
    400: { value: '#B8A997' },
    600: { value: '#7A6F5D' },
    700: { value: '#8B7355' },
    800: { value: '#3D3328' },
    850: { value: '#2A221B' },
    900: { value: '#1A1612' },
  },

  gray: {
    50: { value: '#FFFFFF' },
    200: { value: '#3D4655' },
    300: { value: '#5D6E7D' },
    400: { value: '#4A5568' },
    500: { value: '#7D8B7A' },
    600: { value: '#5A5954' },
    700: { value: '#3F3E3B' },
    800: { value: '#2A2927' },
    850: { value: '#26231F' },
    900: { value: '#1A1918' },
  },
});

const config = defineConfig({
  globalCss: {
    html: { height: '100%' },
    '#root': { height: '100%' },
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
