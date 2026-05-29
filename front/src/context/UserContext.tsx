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

  // --- Try to refresh the token via /auth/refresh ---
  const tryRefreshSession = async (): Promise<User | null> => {
    try {
      const response = await axiosAuth.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  };

  // --- Try to fetch the current user via /auth/me ---
  const fetchUserWithRefresh = async () => {
    try {
      const res = await axiosAuth.get('/api/auth/me');
      setUser(res.data.data);
    } catch {
      try {
        await tryRefreshSession();
        const res = await axiosAuth.get('/api/auth/me');
        setUser(res.data.data);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    fetchUserWithRefresh();
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
  if (!context) throw new Error('useCurrentUser must be used within a UserProvider');
  return context;
};
