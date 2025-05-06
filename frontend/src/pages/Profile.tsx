import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMessageSquare } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.id === Number(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);

        if (!isOwnProfile) {
          const followingRes = await api.get(
            `/users/${currentUser?.id}/following`,
          );
          setIsFollowing(
            followingRes.data.some((f: { id: number }) => f.id === res.data.id),
          );
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    await api.post(`/users/${currentUser?.id}/follow`);
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user && !currentUser)
    return <div className="text-center py-8">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {user?.username}
          </h2>

          {user?.isVerified && (
            <Badge variant="outline" className="gap-2 px-4 py-1.5">
              <img
                src="/images/verified-badge.png"
                alt="Verified"
                className="w-5 h-5"
              />
              <span>Verified Chef</span>
            </Badge>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-300 text-center mt-4 mb-6 md:mb-8">
          {user?.bio || "No bio yet."}
        </p>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Coin Display */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            <img src="/images/coin2.gif" alt="Coins" className="w-8 h-8" />
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.coins}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 rounded-lg text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.totalPost}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Posts</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 rounded-lg text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.totalLikes}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Likes</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isOwnProfile ? (
            <>
              <Button
                size="lg"
                variant={isFollowing ? "outline" : "default"}
                className="w-full sm:w-auto"
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto gap-2"
                disabled={!currentUser?.isVerified}
                title={currentUser?.isVerified ? "" : "Verify account to chat"}
              >
                <FiMessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/edit-profile">Edit Profile</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
