import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/axiosConfig.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { CommentComponent } from "@/components/comment/comment.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import LearningPlanSelectionModal from "../../components/ui/LearningPlanSelectionModal";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  likeCount: number;
  isLiked: boolean;
  commentsCount?: number;
}

const GetAllPostsForUsers: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");

        const transformedPosts = response.data.map((post: Post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl || "",
          likeCount: post.likeCount || 0,
          isLiked: post.isLiked || false,
        }));
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts().then();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const response = await api.post(`/posts/like/${postId}`);
      const updatedPost = response.data.result;

      // Update the post in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: updatedPost.likeCount,
                isLiked: updatedPost.isLiked,
              }
            : post,
        ),
      );

      console.log(updatedPost);
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "An unexpected error occurred.";
      alert(errorMessage);
      console.error("Like error:", errorMessage);
    }
  };

  const handleCommentClick = (postId: number) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleShare = (postId: number) => {
    const url = `http://localhost:5173/post/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  const handleSaveClick = (post: Post) => {
    setSelectedPost(post);
    setShowSaveModal(true);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">All Posts</h2>
        <p className="text-muted-foreground">
          Tip: New posts or updates will appear automatically without needing to
          refresh
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Image Section */}
              {post.imageUrl && (
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    {post.imageUrl.length > 50 ? (
                      <img
                        src={`http://localhost:8080/images/${post.imageUrl.split(",")[0].trim()}`}
                        alt={`Post ${post.id}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <img
                        src={`http://localhost:8080/images/${
                          post.imageUrl.length === 40
                            ? post.imageUrl
                            : post.imageUrl.split("\\").pop()
                        }`}
                        className="object-cover w-full h-full"
                        alt="Post content"
                      />
                    )}
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              {/* Content Section */}
              <div className="p-4 space-y-3">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {post.content}
                  </p>
                </CardContent>

                <CardFooter className="p-0 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="gap-1 text-gray-600 hover:text-red-500 px-2"
                    >
                      {post?.isLiked ? (
                        <Heart className="text-red-500 fill-red-500 w-4 h-4" />
                      ) : (
                        <Heart className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs">{post.likeCount}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentClick(post?.id)}
                      className="gap-1 text-gray-600 hover:text-blue-500 px-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post?.commentsCount}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post.id)}
                      className="gap-1 text-gray-600 hover:text-green-500 px-2"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveClick(post)}
                      className="hover:text-blue-600 px-2 gap-1"
                      title="Save to Learning Plan"
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                    <Link to={`/post/${post.id}/all`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Post
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showComments && selectedPostId && (
        <CommentComponent
          onClose={() => setShowComments(false)}
          postId={selectedPostId}
        />
      )}

      {selectedPost && (
        <LearningPlanSelectionModal
          isOpen={showSaveModal}
          onClose={() => {
            setShowSaveModal(false);
            setSelectedPost(null);
          }}
          postTitle={selectedPost.title}
          postContent={selectedPost.content}
          postUrl={`http://localhost:5173/post/${selectedPost.id}/all`}
        />
      )}
    </div>
  );
};

export default GetAllPostsForUsers;
