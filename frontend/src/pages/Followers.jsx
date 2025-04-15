import React, { useEffect, useState, useContext } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import ChatPopup from './ChatPopup';

const Followers = () => {
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await api.get(`/users/${currentUser.id}/followers`);
      setFollowers(res.data);
    };
    fetchFollowers();
  }, [currentUser]);

  const handleChatClick = (user) => {
    if (currentUser?.isVerified) {
      setSelectedChatUser(user);
    }
  };

  const closeChat = () => setSelectedChatUser(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Followers</h2>
      {followers.map((follower) => (
        <div key={follower.id} className="bg-white p-4 mb-2 shadow rounded flex justify-between items-center">
          <div>
            <p className="font-medium">{follower.firstName} {follower.lastName}</p>
            <p className="text-sm text-gray-500">@{follower.username}</p>
          </div>

          <button
            onClick={() => handleChatClick(follower)}
            className={`p-2 rounded-full ${
              currentUser?.isVerified ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!currentUser?.isVerified}
            title={
              currentUser?.isVerified
                ? 'Click to chat'
                : 'You must be verified to chat'
            }
          >
            <FiMessageSquare size={20} />
          </button>
        </div>
      ))}

      {selectedChatUser && (
        <ChatPopup user={selectedChatUser} onClose={closeChat} />
      )}
    </div>
  );
};

export default Followers;
