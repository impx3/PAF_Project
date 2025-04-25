import { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import FollowButton from '../components/FollowButton';

import styles from '../styles/UserList.module.css';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

const UserList = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [followStatus, setFollowStatus] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get('/users');
      const otherUsers = res.data.filter((u: User) => u.id !== currentUser.id);
      setUsers(otherUsers);
    };
    fetchUsers();
  }, [currentUser]);

  const toggleFollow = async (targetId: number) => {
    await api.post(`/users/${targetId}/follow`);
    setFollowStatus((prev) => ({
      ...prev,
      [targetId]: !prev[targetId],
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Discover Other Chef Enthusiasts!</h2>
      {users.map((user) => (
        <div key={user.id} className={styles.card}>
          <div>
            <p className={styles.name}>{user.firstName} {user.lastName}</p>
            <p className={styles.username}>@{user.username}</p>
          </div>
          <FollowButton targetId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default UserList;
