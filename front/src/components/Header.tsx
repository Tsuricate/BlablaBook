import { Show, Box, Flex, HStack, Text, Heading, Separator } from '@chakra-ui/react';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';
import { useLocation } from 'react-router';

import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

const NavSeparator = () => (
  <Separator orientation="vertical" height="5" borderColor="light.200" borderWidth="1.5px" />
);

const Header = () => {
  const { t } = useTranslation('common');
  const { user, isLoggedIn } = useCurrentUser();
  const { pathname } = useLocation();

  return (
    <>
      <Flex p={4} align="center">
        <Box flex="1" display={{ base: 'none', md: 'block' }} />

        <Box flex="1" display="flex" justifyContent="center" ml={{ base: 0, md: 0 }}>
          <Heading
            fontFamily="Marcellus SC"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            color="white"
            letterSpacing={2}
          >
            BlablaBook
          </Heading>
        </Box>

        <HStack flex="1" justify="flex-end" gap={4}>
          <ThemeToggle />

          <HStack gap={6} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/" icon={LiaCompass}>
              {t('nav.discover')}
            </NavLink>
           <NavSeparator />
            <NavLink to="/library" icon={TbBookFilled}>
              {t('nav.library')}
            </NavLink>
            <NavSeparator />
            {isLoggedIn ? (
              <NavLink to="/account" icon={BsPersonCircle}>
                <Text whiteSpace="nowrap">{user?.username}</Text>
              </NavLink>
            ) : (
              <NavLink to="/login" icon={BsPersonCircle}>
                <Text whiteSpace="nowrap">{t('nav.login')}</Text>
              </NavLink>
            )}
          </HStack>
        </HStack>
      </Flex>
      <Box textAlign="center" mt={10}>
        <Show when={pathname === '/library'}>
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color="white">
            Ma bibliothèque
          </Heading>
        </Show>
      </Box>
    </>
  );
};

export default Header;
