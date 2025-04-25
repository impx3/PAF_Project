import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiUser,
  FiLogOut,
  FiCompass,
} from 'react-icons/fi';
import styles from '../styles/Sidebar.module.css';

interface SidebarProps {
  toggleLeftPanel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleLeftPanel }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.topSection}>
        <h2 className={styles.logo}>Chop</h2>
        <nav className={styles.navLinks}>
          <Link to="/home">
            <FiHome /> Home
          </Link>
          <Link to="/explore">
            <FiCompass /> Explore
          </Link>
          <Link to={`/profile/${currentUser?.id}`}>
            <FiUser /> Profile
          </Link>
          <Link to="/followers">
            <FiUsers /> Followers
          </Link>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.profileActions}>
          <img
            src={currentUser?.profileImage || '/default-avatar.png'}
            alt="User"
            className={styles.avatar}
            onClick={toggleLeftPanel}
            title="Open Profile"
          />
          <button onClick={handleLogout} className={styles.logout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
