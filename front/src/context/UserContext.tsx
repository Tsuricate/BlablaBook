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

  const getMe = async () => {
    const res = await axiosAuth.get('/api/auth/me');
    return res.data.data;
  };

  const initAuth = async () => {
    try {
      const user = await getMe();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    initAuth();
  }, []);

  if (loading) return <Spinner />;

  return (
    <UserContext.Provider value={{ user, isLoggedIn, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useCurrentUser must be used within a UserProvider');
  return context;
};
