import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams(); // target user
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      setIsFollowing(currentUser.following?.some(f => f.id === res.data.id));
    };
    fetchUser();
  }, [id, currentUser]);

  const handleFollow = async () => {
    await api.post(`/users/${id}/follow`);
    setIsFollowing(!isFollowing);
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6"> {/*ml-64 p-4 max-w-lg mx-auto*/}
      <div className="bg-white rounded shadow p-6"> {/*rounded-lg shadow*/}
        <h2 className="text-xl font-bold">{user.username}</h2>
        {user.isVerified && (
          <span className="text-green-600 ml-2">✔ Verified</span>
        )}
        <p className="text-gray-500 mt-1">{user.bio || 'No bio yet.'}</p>

        <div className="mt-4 flex gap-3">
          <button
            className={`px-4 py-2 rounded ${
              isFollowing ? 'bg-red-200' : 'bg-blue-600 text-white'
            }`}
            onClick={handleFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>

          <button
            disabled={!currentUser.isVerified}
            className={`px-4 py-2 rounded ${
              currentUser.isVerified
                ? 'bg-purple-600 text-white'
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
            }`}
          >
            {currentUser.isVerified ? 'Chat' : 'Chat (Disabled)'}
          </button>
          <Link to="/edit-profile" className="text-blue-500 underline ml-2">Edit Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
