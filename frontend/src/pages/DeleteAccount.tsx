import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import styles from '../styles/DeleteAccount.module.css';

const DeleteAccount: React.FC = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete('/users/delete');
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Delete Account</h2>
      <button className={styles.deleteBtn} onClick={handleDelete}>
        Confirm Delete
      </button>
    </div>
  );
};

export default DeleteAccount;
