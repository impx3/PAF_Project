import React, { createContext, useEffect, useState, ReactNode } from 'react';
import api from '../utils/axiosConfig';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage: string;
  isVerified: boolean;
  coins: number;
  // Add other user fields
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchCurrentUser = async () => {
  try {
    const res = await api.get('/users/me');
    if (res.data?.result) {
      setCurrentUser(res.data.result);
    } else {
      throw new Error('Invalid response: missing result');
    }
  } catch (err) {
    console.error('Auth fetch error:', err);
    localStorage.removeItem('token');
    setCurrentUser(null);
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
