import React from 'react';
import { Box } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router';
import { useColorModeValue } from './ui/color-mode';

interface NavLinkProps {
  to: string;
  icon?: React.ElementType;
  vertical?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, vertical = false, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeColor = useColorModeValue('brown.600', 'brown.200');
  const defaultColor = useColorModeValue('brown.400', 'brown.600');
  const color = isActive ? activeColor : defaultColor;

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
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-1px)',
        }}
      >
        {icon && React.createElement(icon, { size: 20 })}
        {children}
      </Box>
    </RouterLink>
  );
};

export default NavLink;
