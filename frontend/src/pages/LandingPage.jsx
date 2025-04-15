import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to Chop!</h1>
      <div className="space-x-4">
        <button onClick={() => navigate('/register')} className="bg-green-600 text-white px-6 py-3 rounded-lg">Register</button>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Login</button>
      </div>
    </div>
  );
};

export default LandingPage;
