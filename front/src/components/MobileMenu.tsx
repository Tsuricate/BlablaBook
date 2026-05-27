import { Flex, Text } from '@chakra-ui/react';
import NavLink from './NavLink';
import { LiaCompass } from 'react-icons/lia';
import { TbBookFilled } from 'react-icons/tb';
import { BsPersonCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../context/UserContext';

const MobileMenu = () => {
  const { t } = useTranslation('common');
  const { user, isLoggedIn } = useCurrentUser();

  return (
    <Flex
      as="nav"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={{ _light: 'brown.400', _dark: 'brown.800' }}
      borderTop={{
        _light: '1px solid var(--chakra-colors-light-200)',
        _dark: '1px solid var(--chakra-colors-brown-600)',
      }}
      justify="space-around"
      py={3}
    >
      <NavLink to="/" icon={LiaCompass} vertical>
        {t('nav.discover')}
      </NavLink>

      <NavLink to="/library" icon={TbBookFilled} vertical>
        {t('nav.library')}
      </NavLink>

      {isLoggedIn ? (
        <NavLink to="/account" vertical icon={BsPersonCircle}>
          <Text whiteSpace="nowrap" fontWeight="bold">
            {user?.username}
          </Text>
        </NavLink>
      ) : (
        <NavLink to="/login" icon={BsPersonCircle} vertical>
          {t('nav.login')}
        </NavLink>
      )}
    </Flex>
  );
};

export default MobileMenu;
