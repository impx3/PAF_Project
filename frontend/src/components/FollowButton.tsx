import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import styles from "../styles/FollowButton.module.css";
import { useAuth } from "@/context/AuthContext.tsx";
import { getFollowing, PublicUser } from "@/services/user.service.ts";

interface FollowButtonProps {
  targetId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentUser } = useAuth();
  const [followingList, setFollowingList] = useState<PublicUser[]>([]);

  const fetchFollowingList = async () => {
    if (!currentUser) return;
    const res = await getFollowing(currentUser?.id);

    setFollowingList(res);
  };

  useEffect(() => {
    fetchFollowingList().then();
  }, [currentUser?.id]);

  useEffect(() => {
    const isUserFollowing = followingList.some(
      (user) => user.id.toString() === targetId,
    );
    setIsFollowing(isUserFollowing);
  }, [followingList, targetId]);

  const toggleFollow = async () => {
    if (isFollowing) {
      const confirmUnfollow = window.confirm(
        "Are you sure you want to unfollow this user?",
      );
      if (!confirmUnfollow) return;
    }

    try {
      await api.post(`/users/${currentUser?.id}/follow/${targetId}`);

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`${styles.followBtn} ${isFollowing ? styles.following : styles.notFollowing}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
