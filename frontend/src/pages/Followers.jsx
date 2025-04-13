import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Followers = () => {
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await api.get(`/users/${currentUser.id}/followers`);
      setFollowers(res.data);
    };
    fetchFollowers();
  }, [currentUser]);

  return (
    <div className="p-6">  //ml-64
      <h2 className="text-xl font-bold mb-4">Your Followers</h2>
      {followers.map((follower) => (
        <div key={follower.id} className="bg-white p-4 mb-2 shadow rounded">
          {follower.username}
        </div>
      ))}
    </div>
  );
};

export default Followers;
