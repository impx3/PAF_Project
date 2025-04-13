import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

const DeleteAccount = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete('/users/delete');
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      //alert('Error deleting account');
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={handleDelete}
      >
        Confirm Delete
      </button>
    </div>
  );
};

export default DeleteAccount;
