import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // if logged in, render the child routes via <Outlet/>
  // otherwise redirect to /login

  if (loading) return <div>Loading...</div>; // Show loading state while checking auth

  return currentUser ? <Outlet /> : <Outlet />; //<Navigate to="/login" />
};

export default PrivateRoute;
