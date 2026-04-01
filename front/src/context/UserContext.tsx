import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import { Spinner } from '@chakra-ui/react';
import { axiosAuth } from '../utils/axiosAuth';
import axios from 'axios';

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

  // --- Try to fetch the current user via /auth/me ---
  const tryFetchUser = async (): Promise<User | null> => {
    try {
      const response = await axiosAuth.get('/api/auth/me');
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  };

  // --- Try to refresh the token via /auth/refresh ---
  const tryRefreshSession = async (): Promise<User | null> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        withCredentials: true,
      });
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  };

  const fetchUserWithRefresh = async () => {
    let currentUser = await tryFetchUser();

    if (!currentUser) {
      currentUser = await tryRefreshSession();
    }

    setUser(currentUser);
    setLoading(false);
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
