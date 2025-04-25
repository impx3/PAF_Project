import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import styles from '../styles/Profile.module.css';

interface User {
  id: number;
  username: string;
  isVerified: boolean;
  bio?: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      setIsFollowing(
        currentUser?.following?.some((f: { id: number }) => f.id === res.data.id)
      );
    };
    fetchUser();
  }, [id, currentUser]);

  const handleFollow = async () => {
    await api.post(`/users/${id}/follow`);
    setIsFollowing(!isFollowing);
  };

  if (!user) return <div className={styles.wrapper}>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.username}>{user.username}</h2>
        {user.isVerified && <span className={styles.verified}>✔ Verified</span>}
        <p className={styles.bio}>{user.bio || 'No bio yet.'}</p>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.followBtn} ${isFollowing ? styles.unfollow : styles.follow}`}
            onClick={handleFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>

          <button
            disabled={!currentUser?.isVerified}
            className={`${styles.chatBtn} ${!currentUser?.isVerified && styles.disabled}`}
          >
            {currentUser?.isVerified ? 'Chat' : 'Chat (Disabled)'}
          </button>

          <Link to="/edit-profile" className={styles.editLink}>
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;