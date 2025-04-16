import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiUsers, FiUser, FiLogOut, FiCompass } from 'react-icons/fi';
import LeftPanel from './LeftPanel';

const Sidebar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLeftPanel = () => setLeftPanelOpen(!isLeftPanelOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-48 bg-white border-r shadow-lg flex flex-col justify-between z-40">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chop</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/home" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FiHome /> Home</Link>
          <Link to="/explore" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FiCompass /> Explore</Link>
          <Link to={`/profile/${currentUser?.id}`} className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FiUser /> Profile</Link>
          <Link to="/followers" className="flex items-center gap-2 text-gray-700 hover:text-blue-600"><FiUsers /> Followers</Link>
        </nav>
      </div>

      <div className="p-4 border-t">
        {/* Profile Pic triggers profile panel */}
        <div className="flex items-center justify-between">
          <img
            src={currentUser?.profileImage || '/default-avatar.png'}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={toggleLeftPanel}
            title="Open Profile"
          />
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            <FiLogOut className="inline mr-1" /> Logout
          </button>
        </div>
      </div>

      {/* Profile Panel */}
      <LeftPanel isOpen={isLeftPanelOpen} toggleLeftPanel={toggleLeftPanel} />
    </div>
  );
};

export default Sidebar;