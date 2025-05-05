import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './utils/AppRouting';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
      </BrowserRouter>
    </AuthProvider>
  );
};


export default App;
