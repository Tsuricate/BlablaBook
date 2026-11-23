import React from 'react';
import { Box } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router';

interface NavLinkProps {
  to: string;
  icon?: React.ElementType;
  vertical?: boolean;
  onImage?: boolean;
  children: React.ReactNode;
  iconColor?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  icon,
  vertical = false,
  onImage = true,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  if (!vertical) {
    const textColor = onImage
      ? 'white'
      : isActive
        ? { _light: 'white', _dark: '#1A1612' }
        : 'ui.text';
    const activeBg = onImage ? 'whiteAlpha.400' : 'ui.accent';

    return (
      <RouterLink to={to} aria-current={isActive ? 'page' : undefined}>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          gap={2}
          px={3}
          py={1.5}
          borderRadius="full"
          fontFamily="body"
          fontSize="md"
          fontWeight={isActive ? 'semibold' : 'medium'}
          whiteSpace="nowrap"
          color={textColor}
          bg={isActive ? activeBg : 'transparent'}
          transition="background-color 0.2s ease"
          _hover={{ bg: isActive ? activeBg : onImage ? 'whiteAlpha.200' : 'ui.raised' }}
        >
          {icon && React.createElement(icon, { size: 18 })}
          {children}
        </Box>
      </RouterLink>
    );
  }

  return (
    <RouterLink
      to={to}
      aria-current={isActive ? 'page' : undefined}
      style={{ flex: 1, minWidth: 0 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1}
        color={isActive ? 'ui.accentText' : 'ui.muted'}
        transition="color 0.2s ease"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="56px"
          h="30px"
          borderRadius="full"
          bg={
            isActive ? { _light: 'rgba(201,138,46,0.28)', _dark: 'ui.accentSoft' } : 'transparent'
          }
          transition="background-color 0.2s ease"
        >
          {icon && React.createElement(icon, { size: 24 })}
        </Box>
        <Box
          as="span"
          fontFamily="body"
          fontSize="xs"
          fontWeight={isActive ? 'semibold' : 'medium'}
          maxW="100%"
          truncate
        >
          {children}
        </Box>
      </Box>
    </RouterLink>
  );
};

export default NavLink;
