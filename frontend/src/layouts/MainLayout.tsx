import React, { useState, ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import LeftPanel from '../components/LeftPanel';
import '../styles/MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(false);

  const toggleLeftPanel = () => {
    setLeftPanelOpen(!isLeftPanelOpen);
  };

  return (
    <div className="main-layout-container">
      <Sidebar toggleLeftPanel={toggleLeftPanel} />
      <main className="main-layout-content">{children}</main>
      <LeftPanel isOpen={isLeftPanelOpen} toggleLeftPanel={toggleLeftPanel} />
    </div>
  );
};

export default MainLayout;
