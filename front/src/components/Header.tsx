import { Show, Box, Flex, HStack, Heading } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { useLocation } from 'react-router';

import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';
import { useColorMode } from './ui/color-mode';

interface HeaderProps {
  imagePosition?: 'top' | 'left';
}

const Header = ({ imagePosition }: HeaderProps) => {
  const { t } = useTranslation('common');
  const { user, isLoggedIn } = useCurrentUser();
  const { pathname } = useLocation();
  const { colorMode } = useColorMode();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const isDarkTextMode = imagePosition === 'left' && colorMode === 'light' && isDesktop;
  const darkHeaderColor = isDarkTextMode ? 'ui.text' : 'white';

  return (
    <>
      <Flex p={4} align="center">
        <Box flex="1" display={{ base: 'none', md: 'block' }} />

        <Box flex="1" display="flex" justifyContent="center" ml={{ base: 0, md: 0 }}>
          <Heading
            fontFamily="Marcellus SC"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            color={darkHeaderColor}
            letterSpacing={2}
          >
            BlablaBook
          </Heading>
        </Box>

        <HStack flex="1" justify="flex-end" gap={4}>
          <ThemeToggle />

          <HStack
            gap={1}
            p={1}
            borderRadius="full"
            display={{ base: 'none', md: 'flex' }}
            borderWidth="1px"
            borderColor={isDarkTextMode ? 'ui.border' : 'whiteAlpha.300'}
            bg={isDarkTextMode ? 'ui.surface' : 'blackAlpha.300'}
            backdropFilter={isDarkTextMode ? undefined : 'blur(10px)'}
          >
            <NavLink to="/" icon={LiaCompass} onImage={!isDarkTextMode}>
              {t('nav.discover')}
            </NavLink>
            <NavLink to="/library" icon={TbBookFilled} onImage={!isDarkTextMode}>
              {t('nav.library')}
            </NavLink>
            {isLoggedIn ? (
              <NavLink to="/account" icon={BsPersonCircle} onImage={!isDarkTextMode}>
                {user?.username}
              </NavLink>
            ) : (
              <NavLink to="/login" icon={BsPersonCircle} onImage={!isDarkTextMode}>
                {t('nav.login')}
              </NavLink>
            )}
          </HStack>
        </HStack>
      </Flex>
      <Box textAlign="center" mt={10}>
        <Show when={pathname === '/library'}>
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color={darkHeaderColor}>
            {t('common:myLibrary')}
          </Heading>
        </Show>
      </Box>
    </>
  );
};

export default Header;
