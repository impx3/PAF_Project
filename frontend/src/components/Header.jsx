import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LeftPanel from './LeftPanel';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(false);

  const toggleLeftPanel = () => setLeftPanelOpen(!isLeftPanelOpen);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
      <h1 className="text-xl font-bold text-gray-800">Chop</h1>
      {currentUser && (
        <>
          <img
            src={currentUser.profileImage || '/default-avatar.png'}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={toggleLeftPanel}
          />
          <LeftPanel isOpen={isLeftPanelOpen} toggleLeftPanel={toggleLeftPanel} />
        </>
      )}
    </header>
  );
};

export default Header;
