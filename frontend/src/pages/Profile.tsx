import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { FiMessageSquare } from 'react-icons/fi';
import styles from '../styles/Profile.module.css';

interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  bio?: string;
  coins: number;
  totalLikes: number;
  totalPost: number;
}

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.id === Number(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);

          if (!isOwnProfile) {
              const followingRes = await api.get(`/users/${currentUser?.id}/following`);
              setIsFollowing(followingRes.data.some((f: { id: number }) => f.id === res.data.id));
          }

        /*if (currentUser?.following) {
          const followingIds = currentUser.following.map((f) => f.id);
          setIsFollowing(followingIds.includes(res.data.id));
        }*/
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser().then();
  }, [id, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    await api.post(`/users/${currentUser?.id}/follow`);
    setIsFollowing(!isFollowing);
  };

  if (!user) return <div className={styles.wrapper}>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.username}>{user.username}</h2>
          {user.isVerified && (
              <span className={styles.verifiedBadge}>
   	 	<img src="/images/verified-badge.png" alt="Verified" 				className={styles.verifiedIcon} />
    		<span className={styles.verifiedText}>Verified 		Chef</span>
  	</span>
          )}

        <p className={styles.bio}>{user.bio || 'No bio yet.'}</p>

        {/* Coin Display */}
        <div className={styles.coinDisplay}>
          <img src="/images/coin2.gif" alt="Coin" className={styles.coinIcon} />
          <p className={styles.info}>{user.coins}</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{user.totalPost}</span>
            <span className={styles.statLabel}>Posts</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{user.totalLikes}</span>
            <span className={styles.statLabel}>Likes</span>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          {!isOwnProfile && (
            <>
              <button
                className={`${styles.followBtn} ${isFollowing ? styles.unfollow : styles.follow}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>

              <div className={styles.chatButtonWrapper}>
                <button
                  className={`${styles.chatBtn} ${
                    currentUser?.isVerified ? styles.verified : styles.unverified
                  }`}
                  title={currentUser?.isVerified ? 'Chat unlocked' : 'Chat locked'}
                  disabled={!currentUser?.isVerified}
                >
                  <FiMessageSquare size={20} />
                </button>
              </div>
            </>
          )}

          {isOwnProfile && (
            <Link to="/edit-profile" className={styles.editLink}>
              Edit Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
