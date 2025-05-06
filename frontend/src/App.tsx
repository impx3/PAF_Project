import React from "react";

import { ToastContainer } from "react-toastify";
import { AppRouting } from "@/utils/AppRouting.tsx";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouting />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
    </AuthProvider>
  );
};
