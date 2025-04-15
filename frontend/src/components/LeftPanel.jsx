//Sidebar profile

import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiMessageSquare } from 'react-icons/fi';

const LeftPanel = ({ isOpen, toggleLeftPanel }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const panelRef = useRef();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        toggleLeftPanel(); // Closing the panel
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleLeftPanel]);

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>    
      <div ref={panelRef} className="p-4 text-center h-full overflow-y-auto">
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

        <h2 className="text-xl font-bold my-6">Menu</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/home" className="hover:text-blue-400">Home</Link>
          <Link to={`/profile/${currentUser?.id}`} className="hover:text-blue-400">Profile</Link>
          <Link to="/followers" className="hover:text-blue-400">Followers</Link>
          <Link to="/delete-account" className="hover:text-red-400">Delete Account</Link>
        </nav>
      </div>
    </div>
  );
};

export default LeftPanel;

//<div className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-50
//  transition-all duration-300 ease-in-out
//  ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
