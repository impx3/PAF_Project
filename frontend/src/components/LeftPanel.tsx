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

	<div className={styles.followStats}>
  	<p>Followers: {currentUser?.followerCount ?? 0}</p>
  	<p>Following: {currentUser?.followingCount ?? 0}</p>
	</div>

	<div className={styles.coinDisplay}>
 		 <img src="/images/coin2.gif" alt="Coin" className=			{styles.coinIcon} />
  		<p className={styles.info}>{currentUser?.coins}</p>
	</div>

        <nav className={styles.navLinks}>
         
          <Link to="/delete-account" className={styles.deleteLink}>Delete Account</Link>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;
