import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: currentUser.username || '',
    bio: currentUser.bio || '',
    profileImage: currentUser.profileImage || ''
  });

  const navigate = useNavigate();

  const handleUpdate = async () => {
    try {
      await api.put('/users/me', form);
      toast.success('Profile updated successfully');
      setCurrentUser({ ...currentUser, ...form });
      navigate(`/profile/${currentUser.id}`);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      <label className="block mb-2 text-sm font-medium">Username</label>
      <input
        type="text"
        className="border p-2 mb-4 block w-full rounded"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <label className="block mb-2 text-sm font-medium">Bio</label>
      <textarea
        className="border p-2 mb-4 block w-full rounded"
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />

      <label className="block mb-2 text-sm font-medium">Profile Image URL</label>
      <input
        type="text"
        className="border p-2 mb-4 block w-full rounded"
        value={form.profileImage}
        onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
