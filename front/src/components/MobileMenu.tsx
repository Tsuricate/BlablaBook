import { Flex } from '@chakra-ui/react';
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
      left={0}
      right={0}
      zIndex={10}
      bg={{ _light: 'light.200', _dark: 'ui.surface' }}
      borderTopWidth="1px"
      borderColor={{ _light: 'light.400', _dark: 'rgba(255,255,255,0.12)' }}
      boxShadow={{
        _light: '0 -8px 24px rgba(61,51,40,0.12)',
        _dark: '0 -6px 20px rgba(0,0,0,0.5)',
      }}
      justify="space-around"
      px={2}
      pt={2}
      bottom="-1px"
      pb="calc(9px + env(safe-area-inset-bottom))"
    >
      <NavLink to="/" icon={LiaCompass} vertical>
        {t('nav.discover')}
      </NavLink>

      <NavLink to="/library" icon={TbBookFilled} vertical>
        {t('nav.library')}
      </NavLink>

      {isLoggedIn ? (
        <NavLink to="/account" icon={BsPersonCircle} vertical>
          {user?.username}
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
