import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

const LandingPage: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Welcome to Chop!</h1>
      <div className={styles.buttonGroup}>
        <button onClick={() => navigate('/register')} className={styles.registerBtn}>
          Register
        </button>
        <button onClick={() => navigate('/login')} className={styles.loginBtn}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
