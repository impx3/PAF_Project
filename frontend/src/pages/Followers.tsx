import React, { useEffect, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import ChatPopup from "../components/ChatPopup";

import styles from "../styles/Followers.module.css";

interface Follower {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

const Followers: React.FC = () => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<Follower | null>(
    null,
  );

  useEffect(() => {
    const fetchFollowers = async () => {
      if (currentUser?.id) {
        const res = await api.get(`/users/${currentUser.id}/followers`);
        setFollowers(res.data);
      }
    };
    fetchFollowers();
  }, [currentUser]);

  const handleChatClick = (user: Follower) => {
    if (currentUser?.isVerified) {
      setSelectedChatUser(user);
    }
  };

  const closeChat = () => setSelectedChatUser(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Followers</h2>
      {followers.map((follower) => (
        <div key={follower.id} className={styles.followerCard}>
          <div>
            <p className={styles.followerName}>
              {follower.firstName} {follower.lastName}
            </p>
            <p className={styles.followerUsername}>@{follower.username}</p>
          </div>

          <button
            onClick={() => handleChatClick(follower)}
            className={`${styles.chatButton} ${
              currentUser?.isVerified ? styles.verified : styles.disabled
            }`}
            disabled={!currentUser?.isVerified}
            title={
              currentUser?.isVerified
                ? "Click to chat"
                : "You must be verified to chat with this user"
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
