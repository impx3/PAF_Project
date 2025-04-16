import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import FollowButton from '../components/FollowButton';

const UserList = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get('/users');
      const otherUsers = res.data.filter(u => u.id !== currentUser.id);
      setUsers(otherUsers);
    };
    fetchUsers();
  }, [currentUser]);

  const toggleFollow = async (targetId) => {
    await api.post(`/users/${targetId}/follow`);
    setFollowStatus(prev => ({
      ...prev,
      [targetId]: !prev[targetId]
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Discover Other Chef Enthusiasts!</h2>
      {users.map(user => (
        <div key={user.id} className="bg-white p-4 mb-2 shadow rounded flex justify-between items-center">
          <div>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
          <FollowButton targetId={user.id} />

        </div>
      ))}
    </div>
  );
};

export default UserList;
