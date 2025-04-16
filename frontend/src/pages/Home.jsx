import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {currentUser?.firstName}!</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">You follow:</h2>
        {following.length > 0 ? (
          <ul className="list-disc list-inside">
            {following.map(u => (
              <li key={u.id}>@{u.username}</li>
            ))}
          </ul>
        ) : (
          <p>You’re not following anyone yet!</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Your followers:</h2>
        {followers.length > 0 ? (
          <ul className="list-disc list-inside">
            {followers.map(u => (
              <li key={u.id}>@{u.username}</li>
            ))}
          </ul>
        ) : (
          <p>No followers</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Feed</h2>
        {feedPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 shadow rounded mb-4">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
