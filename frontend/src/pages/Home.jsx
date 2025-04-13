import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [feedPosts, setFeedPosts] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const res = await api.get(`/posts/feed/${currentUser.id}`);
      setFeedPosts(res.data);
    };
    fetchFeed();
  }, [currentUser]);

  return (
    <div className="p-6"> //ml-64
      <h2 className="text-xl font-bold mb-4">Your Feed</h2>
      {feedPosts.map((post) => (
        <div key={post.id} className="bg-white p-4 shadow rounded mb-4">
          <h3 className="font-semibold">{post.title}</h3> //text-lg
          <p className="text-sm text-gray-600">{post.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
