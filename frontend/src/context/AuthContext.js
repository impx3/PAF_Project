import React, { createContext, useEffect, useState } from 'react';
import api from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me');
      setCurrentUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
