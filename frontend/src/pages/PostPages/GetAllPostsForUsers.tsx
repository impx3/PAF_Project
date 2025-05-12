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
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { CommentComponent } from "@/components/comment/comment.tsx";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  likeCount: number;
  isLiked: boolean;
}

const GetAllPostsForUsers: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");

        const transformedPosts = response.data.map((post: Post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl || "",
          likes: post.likeCount || 0,
          isLiked: false,
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
      const updatedPost = response.data.data;

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: updatedPost.likeCount,
            isLiked: updatedPost.isLiked,
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error: any) {
      // Extract error message from the API response
      const message =
        error.response?.data?.message ||
        "An error occurred while liking the post.";
      alert(message);
      console.error("Error updating like:", message);
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
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{post.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 line-clamp-3">{post.content}</p>

                {post.imageUrl && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.imageUrl.length > 50 ? (
                      post.imageUrl.split(",").map((filename, idx) => (
                        <div key={idx} className="overflow-hidden rounded-lg">
                          <AspectRatio ratio={16 / 9}>
                            <img
                              src={`http://localhost:8080/images/${filename.trim()}`}
                              alt={`Post ${post.id} - ${idx}`}
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                        </div>
                      ))
                    ) : (
                      <div className="overflow-hidden rounded-lg">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={`http://localhost:8080/images/${
                              post.imageUrl.length === 40
                                ? post.imageUrl
                                : post.imageUrl.split("\\").pop()
                            }`}
                            className="object-cover w-full h-full"
                            alt="Post content"
                          />
                        </AspectRatio>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="gap-1 text-gray-600 hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likeCount}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCommentClick(post.id)}
                    className="gap-1 text-gray-600 hover:text-blue-500"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post.id)}
                    className="gap-1 text-gray-600 hover:text-green-500"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Link to={`/post/${post.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </CardFooter>
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
    </div>
  );
};

export default GetAllPostsForUsers;
