import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiMessageSquare } from 'react-icons/fi';
import styles from '../styles/LeftPanel.module.css';

interface LeftPanelProps {
  isOpen: boolean;
  toggleLeftPanel: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ isOpen, toggleLeftPanel }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleLeftPanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleLeftPanel]);

  return (
    <div className={`${styles.panelWrapper} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
      <div ref={panelRef} className={styles.panel}>
        <img
          src={currentUser?.profileImage || '/default-avatar.png'}
          className={styles.avatar}
          alt="Profile"
        />
        <h3 className={styles.name}>
          {currentUser?.firstName} {currentUser?.lastName}
        </h3>
        <p className={styles.username}>@{currentUser?.username}</p>
        <p className={styles.info}>Email: {currentUser?.email}</p>
        <p className={styles.info}>Coins: {currentUser?.coins}</p>

        <div className={styles.chatButtonWrapper}>
          <button
            className={`${styles.chatBtn} ${
              currentUser?.isVerified ? styles.verified : styles.unverified
            }`}
            title={currentUser?.isVerified ? 'Chat unlocked' : 'Chat locked'}
            disabled={!currentUser?.isVerified}
          >
            <FiMessageSquare size={20} />
          </button>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FiLogOut /> Logout
        </button>

        <h2 className={styles.menuTitle}>Menu</h2>
        <nav className={styles.navLinks}>
          <Link to="/home">Home</Link>
          <Link to={`/profile/${currentUser?.id}`}>Profile</Link>
          <Link to="/followers">Followers</Link>
          <Link to="/delete-account" className={styles.deleteLink}>Delete Account</Link>
        </nav>
      </div>
    </div>
  );
};

export default LeftPanel;
