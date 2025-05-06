import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import styles from "../styles/EditProfile.module.css";

const EditProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    profileImage: currentUser?.profileImage || "",
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/users/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, profileImage: res.data }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleUpdate = async () => {
    try {
      await api.put("/users/me", form);
      toast.success("Profile updated successfully");
      setCurrentUser({ ...currentUser, ...form });
      navigate(`/profile/${currentUser?.id}`);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Profile</h2>

      <label className={styles.label}>Username</label>
      <input
        type="text"
        className={styles.input}
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <label className={styles.label}>Bio</label>
      <textarea
        className={styles.input}
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />

      <label className={styles.label}>Profile Picture</label>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {uploading && <p>Uploading...</p>}
      {form.profileImage && <img src={form.profileImage} alt="Preview" width={100} />}

      <button onClick={handleUpdate} className={styles.saveBtn}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;