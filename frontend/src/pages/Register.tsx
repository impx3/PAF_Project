import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import styles from '../styles/Register.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface RegisterForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
}


const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordStrong = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{6,}$/.test(password);
  };

  const handleRegister = async () => {
    const { username, email, firstName, lastName, password, confirmPassword } = form;

    if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
      toast.error('Please fill all the required fields!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error('Password should be at least 6 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      console.log('Sending register payload:', payload); 

      const res = await api.post('/auth/register', payload);
      // if (res.data.success) {
      //  localStorage.setItem('token', res.data.result.token);

      if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
            toast.success('Registration successful!');
            navigate('/login');
          } else {
            toast.error(res.data.message || 'Registration failed!');
          }
        } catch (err) {
          toast.error('Something went wrong during registration.');
        }
      };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.heading}>Register</h2>
      {['username', 'email', 'firstName', 'lastName'].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field}
          value={(form as any)[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className={styles.input}
        />
      ))}

      <div className={styles.passwordInputWrapper}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className={styles.input}
        placeholder="Password"
      />
      <span onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </span>
      </div>

      <div className={styles.passwordInputWrapper}>
      <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className={styles.input}
          placeholder="Confirm Password"
        />
        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>

      {/* <input
        type="text"
        placeholder="Profile Image URL (optional)"
        value={form.profileImage}
        onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
        className={styles.input}
      /> */}

      <button onClick={handleRegister} className={styles.registerBtn}>
        Register
      </button>
    </div>
  );
};

export default Register;
