import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC = () => {
  const { currentUser } = useAuth();

  // if logged in, render the child routes via <Outlet/>
  // otherwise redirect to /login
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
