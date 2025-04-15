//Sidebar profile

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LeftPanel = ({ isOpen, toggleLeftPanel }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="p-4 text-center">
    <img src={currentUser?.profileImage || '/default-avatar.png'} className="w-20 h-20 rounded-full mx-auto mb-2" alt="Profile" />
        <h3 className="text-lg font-bold">{currentUser?.firstName} {currentUser?.lastName}</h3>
        <p className="text-sm text-gray-600">@{currentUser?.username}</p>
        <p className="text-sm mt-1">Email: {currentUser?.email}</p>
        <p className="text-sm mt-1">Coins: {currentUser?.coins}</p>
        <div className="flex justify-center mt-4">
          <button
            className={`p-2 rounded-full ${currentUser?.isVerified ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}
            title={currentUser?.isVerified ? "Chat unlocked" : "Chat locked"}
            disabled={!currentUser?.isVerified}
          >
            <FiMessageSquare size={20} />
          </button>
        </div>
        <button onClick={handleLogout} className="mt-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          <FiLogOut /> Logout
        </button>
    <h2 className="text-xl font-bold mb-6">Menu</h2>
    <nav className="flex flex-col space-y-3">
      <Link to="/home" className="hover:text-blue-300">Home</Link>
      <Link to="/profile/user2025001" className="hover:text-blue-300">Profile</Link>
      <Link to="/followers" className="hover:text-blue-300">Followers</Link>
      <Link to="/delete-account" className="hover:text-red-400">Delete Account</Link>
    </nav>
    </div>
    </div>
  );
};

export default LeftPanel;
