import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBookmark } from "react-icons/fa";
import { Trash2, Edit, UserPlus, UserMinus } from "lucide-react";
import LearningPlanSelectionModal from "@/components/ui/LearningPlanSelectionModal.tsx";

import api from "@/utils/axiosConfig";

import {
  deleteCurrentUser,
  getFollowers,
  getFollowing,
  getUserById,
  PublicUser,
  toggleFollow,
  updateProfile,
  uploadProfileImage,
  UserProfile,
} from "@/service/user.service";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;
interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

export const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [followers, setFollowers] = useState<PublicUser[]>([]);
  const [following, setFollowing] = useState<PublicUser[]>([]);

  const handleNavigatePostAddPage = () => {
    navigate("/post/createpostselect");
  };

  const handleNavigateVideoAddPage = () => {
    navigate("/post/createvid");
  };

  const handleSaveClick = (post: Post) => {
    setSelectedPost(post);
    setShowSaveModal(true);
  };

  const navigate = useNavigate();
  const isOwnProfile = currentUser?.id === user?.id;

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const userData = await getUserById(currentUser.id);
        if (userData) {
          setUser(userData);
          setFollowers(await getFollowers(currentUser.id));
          setFollowing(await getFollowing(currentUser.id));
        }

        // Load posts and videos (keep existing implementation)
        const postsRes = await api.get("/posts/user");
        setPosts(postsRes.data);
        const videosRes = await axios.get<Video[]>(`${API_URL}/videos`);
        setVideos(videosRes.data);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // const handleFollow = async () => {
  //   if (!currentUser || !user) return;

  //   try {
  //     const result = await toggleFollow(currentUser.id, user.id);
  //     if (result) {
  //       setIsFollowing(!isFollowing);
  //       toast.success(
  //         isFollowing ? "Unfollowed successfully" : "Followed successfully",
  //       );
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update follow status");
  //   }
  // };

  const handleProfileUpdate = async (updates: {
    bio?: string;
    profileImage?: string;
  }) => {
    if (!user) return;

    try {
      const success = await updateProfile(updates);
      if (success) {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadProfileImage(file);
      if (imageUrl) {
        await handleProfileUpdate({ profileImage: imageUrl });
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const success = await deleteCurrentUser();
        if (success) {
          logout();
          navigate("/");
          toast.success("Account deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !user) {
    return <div className="text-center py-8">User not found</div>;
  }

  // @ts-ignore
  return (
    <div className="p-4">
      <Card className="p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative group">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={(user.profileImage as string) || "/default-avatar.png"}
                alt={user.username as string}
              />
              <AvatarFallback>
                {user?.firstName?.[0] as string}
                {user?.lastName?.[0] as string}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-background p-2 rounded-full cursor-pointer shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImageUpload(e.target.files[0])
                  }
                  className="hidden"
                />
                <Edit className="h-5 w-5" />
              </label>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              {user?.isVerified && (
                <Badge className="gap-2 px-4 py-1.5">
                  <img
                    src="/images/verified-badge.png"
                    alt="Verified"
                    className="w-5 h-5"
                  />
                  Verified Chef
                </Badge>
              )}
              {/* {!isOwnProfile && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                >
                  {isFollowing ? (
                    <UserMinus className="mr-2" />
                  ) : (
                    <UserPlus className="mr-2" />
                  )}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )} */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{user.totalPost}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{user.followerCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{user.followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{user.coins}</p>
                <p className="text-sm text-muted-foreground">Coins</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">About Me</h3>
              <p className="text-muted-foreground">
                {user.bio || "No bio provided"}
              </p>
            </div>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newBio = prompt("Enter new bio", user.bio);
                  if (newBio !== null) {
                    handleProfileUpdate({ bio: newBio });
                  }
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </Button>
          <Button
            variant={activeTab === "chops" ? "default" : "outline"}
            onClick={() => setActiveTab("chops")}
          >
            Chops
          </Button>
          <Button
            variant={activeTab === "activity" ? "default" : "outline"}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </Button>
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="flex gap-4 mb-8">
            <Button asChild variant="outline">
              <Link to="/edit-profile">Edit Profile</Link>
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        )}
        {/* Content Tabs */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className={"flex flex-row justify-between items-center mb-4"}>
              <h2 className="text-2xl font-bold ">My Posts</h2>
              <Button variant={"outline"} onClick={handleNavigatePostAddPage}>
                Add Post
              </Button>
            </div>
            {posts.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No posts available</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveClick(post)}
                      title="Save to Learning Plan"
                    >
                      <FaBookmark className="w-5 h-5" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">{post.content}</p>

                  {post.imageUrl && (
                    <div className="flex flex-wrap gap-4 justify-center mb-4">
                      {post.imageUrl.length > 50 ? (
                        post.imageUrl
                          .split(",")
                          .map((filename, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:8080/images/${filename.trim()}`}
                              alt={`Post ${post.id} - ${idx}`}
                              className="rounded-lg object-cover w-48 h-48"
                            />
                          ))
                      ) : (
                        <img
                          src={`http://localhost:8080/images/${
                            post.imageUrl.length === 40
                              ? post.imageUrl
                              : post.imageUrl.split("\\").pop()
                          }`}
                          alt={`Post ${post.id}`}
                          className="rounded-lg object-cover w-48 h-48"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/post/update/${post.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" asChild>
                      <Link to={`/post/delete/${post.id}`}>Delete</Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
        {activeTab === "chops" && (
          <div className="space-y-6">
            <div className={"flex flex-row justify-between items-center mb-4"}>
              <h2 className="text-2xl font-bold ">My Chops</h2>
              <Button variant={"outline"} onClick={handleNavigateVideoAddPage}>
                Add Chops
              </Button>
            </div>
            {videos.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No posts available</p>
              </Card>
            ) : (
              videos.map((videos) => (
                <Card key={videos.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{videos.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveClick(videos)}
                      title="Save to Learning Plan"
                    >
                      <FaBookmark className="w-5 h-5" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {videos?.description}
                  </p>

                  {videos.videoUrl && (
                    <div className="flex flex-wrap gap-4 justify-center mb-4">
                      {videos.videoUrl.length > 50 ? (
                        videos.videoUrl
                          .split(",")
                          .map((filename, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:8080/images/${filename.trim()}`}
                              alt={`Post ${videos.id} - ${idx}`}
                              className="rounded-lg object-cover w-48 h-48"
                            />
                          ))
                      ) : (
                        <img
                          src={`http://localhost:8080/images/${
                            videos.videoUrl.length === 40
                              ? videos.videoUrl
                              : videos.videoUrl.split("\\").pop()
                          }`}
                          alt={`Post ${videos.id}`}
                          className="rounded-lg object-cover w-48 h-48"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/post/update/${videos.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" asChild>
                      <Link to={`/post/delete/${videos.id}`}>Delete</Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </Card>

      {selectedPost && (
        <LearningPlanSelectionModal
          isOpen={showSaveModal}
          onClose={() => {
            setShowSaveModal(false);
            setSelectedPost(null);
          }}
          postTitle={selectedPost.title}
          postContent={selectedPost.content}
          postUrl={`http://localhost:3000/post/${selectedPost.id}`}
        />
      )}
    </div>
  );
};
