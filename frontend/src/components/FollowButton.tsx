import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import styles from '../styles/FollowButton.module.css';

interface FollowButtonProps {
  targetId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // You can fetch actual follow state here from backend if needed
  }, [targetId]);

  const toggleFollow = async () => {
    if (isFollowing) {
      const confirmUnfollow = window.confirm("Are you sure you want to unfollow this user?");
      if (!confirmUnfollow) return;
    }

    try {
      await api.post(`/users/${targetId}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`${styles.followBtn} ${isFollowing ? styles.following : styles.notFollowing}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
