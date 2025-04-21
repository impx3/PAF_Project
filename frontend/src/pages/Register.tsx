import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../styles/Register.module.css';

interface RegisterForm {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
  try {
    const res = await api.post('/auth/register', form);
    localStorage.setItem('token', res.data.result.token);
    navigate('/login');
    toast.success('Registration successful!');
  } catch (err) {
    toast.error('Registration failed.');
  }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      {(['username', 'email', 'firstName', 'lastName', 'password'] as const).map((field) => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className={styles.input}
        />
      ))}
      <button onClick={handleRegister} className={styles.button}>
        Register
      </button>
    </div>
  );
};

export default Register;
