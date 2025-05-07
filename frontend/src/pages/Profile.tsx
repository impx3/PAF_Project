import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBookmark } from "react-icons/fa";
import LearningPlanSelectionModal from "@/components/ui/LearningPlanSelectionModal.tsx";

interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  bio?: string;
  coins: number;
  totalLikes: number;
  totalPosts: number;
  followers: number;
  following: number;
}

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
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const navigate = useNavigate();

  const handleNavigatePostAddPage = () => {
    navigate("/post/createpostselect");
  };

  const handleNavigateVideoAddPage = () => {
    navigate("/post/createvid");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get(`/users/${currentUser?.id}`);
        setUser(userRes.data);

        const postsRes = await api.get("/posts/user");
        setPosts(postsRes.data);

        api.get<Video[]>("/videos").then((res) => setVideos(res.data));

        /* if (!isOwnProfile) {
          const followingRes = await api.get(`/users/${currentUser?.id}/following`);
          setIsFollowing(followingRes.data.some((f: { id: number }) => f.id === userRes.data.id));
        }*/
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().then();
  }, [currentUser]);

  const handleSaveClick = (post: Post) => {
    setSelectedPost(post);
    setShowSaveModal(true);
  };

  /*  const isOwnProfile = currentUser?.id === Number(id);*/

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

  if (!currentUser)
    return <div className="text-center py-8">User not found</div>;

  return (
    <div className="p-4">
      <Card className="p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={currentUser.profileImage || "/default-avatar.png"}
              alt={currentUser.username}
            />
            <AvatarFallback>
              {currentUser.firstName?.[0]}
              {currentUser.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              {currentUser.isVerified && (
                <Badge className="gap-2 px-4 py-1.5">
                  <img
                    src="/images/verified-badge.png"
                    alt="Verified"
                    className="w-5 h-5"
                  />
                  Verified Chef
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{currentUser.totalPosts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{currentUser.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {currentUser?.following?.length}
                </p>
                <p className="text-sm text-muted-foreground">Following</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">{currentUser.coins}</p>
                <p className="text-sm text-muted-foreground">Coins</p>
              </Card>
            </div>
          </div>
        </div>
        {/* Bio Section */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">About Me</h3>
          <p className="text-muted-foreground">
            {currentUser.bio || "No bio provided"}
          </p>
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
        {/* Action Buttons
        <div className="flex gap-4">
          <Button asChild variant="outline" size="lg">
            <Link to="/edit-profile">Edit Profile</Link>
          </Button>
          <Button variant="outline" size="lg">
            Settings
          </Button>
        </div>*/}
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
