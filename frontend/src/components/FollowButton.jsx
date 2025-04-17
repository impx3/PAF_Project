import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

const FollowButton = ({ targetId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Fetching actual follow state
  }, [targetId]);

  const toggleFollow = async () => {
    // Show confirm dialog when unfollowing a user
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
      className={`px-4 py-1 rounded text-sm font-medium transition-colors duration-300
        ${isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-red-100'
          : 'bg-blue-500 text-white hover:bg-blue-600'}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;