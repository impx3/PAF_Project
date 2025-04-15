import React, { createContext, useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import jwt_decode from 'jwt-decode';

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
    if (token) {
      fetchCurrentUser(); // 💡 Fetch full profile from backend
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

//localStorage.removeItem('token');
//setCurrentUser(null);
//navigate('/'); // or wherever you want to redirect
