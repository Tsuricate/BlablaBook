import { Box, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const options = [
  { lang: 'fr', label: '🇫🇷 Français' },
  { lang: 'en', label: '🇬🇧 English' },
] as const;

const ChangeLanguages = () => {
  const { i18n } = useTranslation();
  const current = i18n.language === 'fr' ? 'fr' : 'en';
  const isEN = current === 'en';

  const changeLanguage = (lang: 'en' | 'fr') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('userLanguage', lang);
  };

  return (
    <Box
      position="relative"
      w="100%"
      bg="ui.raised"
      borderRadius="xl"
      p="4px"
      borderWidth="1px"
      borderColor="ui.border"
      role="radiogroup"
    >
      <Box
        position="absolute"
        top="4px"
        left="4px"
        h="calc(100% - 8px)"
        w="calc(50% - 4px)"
        bg="ui.accentSoft"
        borderWidth="1px"
        borderColor={{ _light: 'rgba(201,138,46,0.45)', _dark: 'rgba(224,164,88,0.4)' }}
        borderRadius="lg"
        transition="transform 0.25s ease"
        transform={isEN ? 'translateX(100%)' : 'translateX(0%)'}
      />

      <HStack position="relative" zIndex={1} gap={0}>
        {options.map(({ lang, label }) => {
          const active = current === lang;
          return (
            <Box
              key={lang}
              as="button"
              role="radio"
              aria-checked={active}
              flex={1}
              textAlign="center"
              py={2}
              cursor="pointer"
              onClick={() => changeLanguage(lang)}
            >
              <Text
                fontSize="sm"
                fontWeight={active ? 'semibold' : 'medium'}
                color={active ? 'ui.accentText' : 'ui.muted'}
                transition="color 0.2s"
              >
                {label}
              </Text>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};

export default ChangeLanguages;
