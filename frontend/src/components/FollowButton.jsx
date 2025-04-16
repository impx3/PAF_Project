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
    //   className={`px-3 py-1 rounded text-white text-sm ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}
    // >
    //   {isFollowing ? 'Unfollow' : 'Follow'}
    className={`px-4 py-1 rounded text-sm font-medium transition-colors duration-300
      ${isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-red-100' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>    
    </button>
  );
};

export default FollowButton;