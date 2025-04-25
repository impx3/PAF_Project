import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
