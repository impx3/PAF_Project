import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const auth = useContext(AuthContext);
  const setCurrentUser = auth?.setCurrentUser;

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', form);
  
      const user = res.data?.result;
  
      if (user?.token) {
        localStorage.setItem('token', user.token);
        if (auth?.setCurrentUser) auth.setCurrentUser(user);
        toast.success('Login successful!');
        navigate('/home');
      } else {
        toast.error('Invalid response from server.');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };
  
  


  return (
    <div className={styles.loginWrapper}>
      <h2 className={styles.heading}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className={styles.inputField}
      />
      <button onClick={handleLogin} className={styles.loginBtn}>
        Login
      </button>
    </div>
  );
};

export default Login;
