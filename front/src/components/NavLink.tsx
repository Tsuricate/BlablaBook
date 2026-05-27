import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router';
import { useColorModeValue } from './ui/color-mode';

interface NavLinkProps {
  to: string;
  icon?: React.ElementType;
  vertical?: boolean;
  children: React.ReactNode;
  iconColor?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, vertical = false, children, iconColor }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  const baseActive = useColorModeValue('light.50', 'brown.100');
  const baseDefault = useColorModeValue('light.200', 'brown.400');

  const color = iconColor ?? (isActive ? baseActive : baseDefault);

  return (
    <RouterLink to={to}>
      <Box
        display="flex"
        flexDirection={vertical ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, md: 2 }}
        color={color}
        fontWeight={isActive ? 'bold' : 'medium'}
        textDecoration={isActive ? 'underline' : 'none'}
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-1px)',
        }}
      >
        {icon &&
          React.createElement(icon, {
            size: 20,
            color: iconColor,
          })}
        <Heading>{children}</Heading>
      </Box>
    </RouterLink>
  );
};

export default NavLink;
