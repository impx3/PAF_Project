import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import LeftPanel from '../components/LeftPanel';

const MainLayout = ({ children }) => {
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(false);

  const toggleLeftPanel = () => {
    setLeftPanelOpen(!isLeftPanelOpen);
  };

  return (
    <div className="flex">
      <Sidebar toggleLeftPanel={toggleLeftPanel} />
      <main className="ml-48 w-full min-h-screen bg-gray-50 p-6">{children}</main>

      {/* Profile Panel appears on top when the profile icon is clicked */}
      <LeftPanel isOpen={isLeftPanelOpen} toggleLeftPanel={toggleLeftPanel} />
    </div>
  );
};

export default MainLayout;