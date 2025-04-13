import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';

const Register = () => {
  const [form, setForm] = useState({
    username: '', password: '', email: '', firstName: '', lastName: ''
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/login');
      toast.success('Registration successful!');
    } catch (err) {
      // alert('Register failed');
	toast.error('Registration failed.');
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {['username', 'email', 'firstName', 'lastName', 'password'].map(field => (
        <input
          key={field}
          type={field === 'password' ? 'password' : 'text'}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="border p-2 mb-2 block w-full rounded"
        />
      ))}
      <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </div>
  );
};

export default Register;
