import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";

import styles from "../styles/UserList.module.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users");
      const otherUsers = res.data.filter((u: User) => u.id !== currentUser?.id);
      setUsers(otherUsers);
    };
    fetchUsers().then();
  }, [currentUser]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Discover Other Chef Enthusiasts!</h2>
      {users.map((user) => (
        <div key={user.id} className={styles.card}>
          <Link to={`/profile/${user.id}`} className={styles.profileLink}>
            <p className={styles.name}>
              {user.firstName} {user.lastName}
            </p>
            <p className={styles.username}>@{user.username}</p>
          </Link>
          <FollowButton targetId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default UserList;
