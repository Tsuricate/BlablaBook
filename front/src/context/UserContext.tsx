import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import { Spinner } from '@chakra-ui/react';
import { axiosAuth } from '../utils/axiosAuth';

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user;

  const fetchMe = async () => {
    try {
      const response = await axiosAuth.get('/auth/me');
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  };

  const initAuth = async () => {
    const userData = await fetchMe();
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    initAuth();
  }, []);

  if (loading) return <Spinner />;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within UserProvider');
  }
  return context;
};
