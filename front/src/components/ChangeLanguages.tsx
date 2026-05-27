import { Box, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ChangeLanguages = () => {
  const { i18n } = useTranslation();
  const current = i18n.language === 'fr' ? 'fr' : 'en';

  const changeLanguage = (lang: 'en' | 'fr') => {
    i18n.changeLanguage(lang);
    // Enregistrer la langue choisie dans le localStorage
    localStorage.setItem('userLanguage', lang);
  };

  const isEN = current === 'en';

  return (
    <Box
      position="relative"
      w="100%"
      bg={{ _light: 'light.200', _dark: 'brown.800' }}
      borderRadius="full"
      p="4px"
      borderWidth="1px"
      borderColor={{ _light: 'light.300', _dark: 'brown.600' }}
    >
      <Box
        position="absolute"
        top="4px"
        left="4px"
        h="calc(100% - 8px)"
        w="calc(50% - 4px)"
        bg={{ _light: 'white', _dark: 'brown.600' }}
        borderRadius="full"
        transition="all 0.25s ease"
        transform={isEN ? 'translateX(100%)' : 'translateX(0%)'}
        boxShadow="sm"
      />

      <HStack position="relative" zIndex={1}>
        <Box
          flex={1}
          textAlign="center"
          py={2}
          cursor="pointer"
          onClick={() => changeLanguage('fr')}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={
              !isEN
                ? { _light: 'gray.800', _dark: 'light.100' }
                : { _light: 'gray.600', _dark: 'light.400' }
            }
            transition="color 0.2s"
          >
            🇫🇷 Français
          </Text>
        </Box>

        <Box
          flex={1}
          textAlign="center"
          py={2}
          cursor="pointer"
          onClick={() => changeLanguage('en')}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={
              isEN
                ? { _light: 'gray.800', _dark: 'light.100' }
                : { _light: 'gray.600', _dark: 'light.400' }
            }
            transition="color 0.2s"
          >
            🇬🇧 English
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default ChangeLanguages;
