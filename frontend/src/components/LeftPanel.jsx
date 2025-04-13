//Sidebar profile

import React from 'react';
import { Link } from 'react-router-dom';

const LeftPanel = () => (
  <div className="fixed left-0 top-0 h-full w-60 bg-gray-900 text-white p-4">
    <h2 className="text-xl font-bold mb-6">Menu</h2>
    <nav className="flex flex-col space-y-3">
      <Link to="/home" className="hover:text-blue-300">Home</Link>
      <Link to="/profile/user2025001" className="hover:text-blue-300">Profile</Link>
      <Link to="/followers" className="hover:text-blue-300">Followers</Link>
      <Link to="/delete-account" className="hover:text-red-400">Delete Account</Link>
    </nav>
  </div>
);

export default LeftPanel;
