import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';

import styles from '../styles/Home.module.css';

interface User {
  id: number;
  username: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  // const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);

  const auth = useContext(AuthContext);

  if (!auth) {
     return <div>Loading...</div>; // or redirect to login, etc.
  }

  const { currentUser } = auth;


  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res1 = await api.get(`/users/${currentUser.id}/followers`);
        const res2 = await api.get(`/users/${currentUser.id}/following`);
        setFollowers(res1.data);
        setFollowing(res2.data);
      } catch (err) {
        console.error('Error loading connections:', err);
      }
    };

    const fetchFeed = async () => {
      try {
        const res = await api.get(`/posts/feed/${currentUser.id}`);
        setFeedPosts(res.data);
      } catch (err) {
        console.error('Error loading feed:', err);
      }
    };

    if (currentUser?.id) {
      fetchConnections();
      fetchFeed();
    }
  }, [currentUser]);

  return (
    <div className={styles.container}>
      <h1 className={styles.greeting}>Welcome, {currentUser?.firstName}!</h1>

      <div className={styles.box}>
        <h2 className={styles.sectionTitle}>You follow:</h2>
        {following.length > 0 ? (
          <ul className={styles.userList}>
            {following.map((u) => (
              <li key={u.id}>@{u.username}</li>
            ))}
          </ul>
        ) : (
          <p>You’re not following anyone yet!</p>
        )}
      </div>

      <div className={styles.box}>
        <h2 className={styles.sectionTitle}>Your followers:</h2>
        {followers.length > 0 ? (
          <ul className={styles.userList}>
            {followers.map((u) => (
              <li key={u.id}>@{u.username}</li>
            ))}
          </ul>
        ) : (
          <p>No followers</p>
        )}
      </div>

      <div>
        <h2 className={styles.feedTitle}>Your Feed</h2>
        {feedPosts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postDesc}>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
