import React, { useState } from 'react';
import api from '../utils/axiosConfig';

const FollowButton = ({ targetId, initialFollowed = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowed);

  const toggleFollow = async () => {
    try {
      await api.post(`/users/${targetId}/follow`);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`px-3 py-1 rounded text-white text-sm ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;