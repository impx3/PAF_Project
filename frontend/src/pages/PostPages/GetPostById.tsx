import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/utils/axiosConfig.ts";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { CommentComponent } from "@/components/comment/comment.tsx";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
}

const GetPostById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleShare = () => {
    const url = `http://localhost:5173/post/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get<Post>(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPost(response.data);
        setLikeCount(response.data.likes || 0);
      })
      .catch((_error) => setError("Post not found"));
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!isLiked) {
        await api.post(`/posts/${id}/like`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikeCount((prev) => prev + 1);
      } else {
        await api.delete(`/posts/${id}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikeCount((prev) => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  if (error) {
    return <h2 className="text-center text-red-500 text-xl mt-8">{error}</h2>;
  }

  return (
    <div className="container  mx-auto px-4 py-8">
      {post ? (
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>

            {post.imageUrl && (
              <div className="grid grid-cols-1 gap-4">
                {post.imageUrl.length > 50 ? (
                  post.imageUrl.split(",").map((filename, idx) => (
                    <div key={idx} className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={`http://localhost:8080/images/${filename.trim()}`}
                          alt={`Post ${post.id} - ${idx}`}
                          className="object-cover w-full h-full rounded-lg"
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
                        className="object-cover w-full h-full rounded-lg"
                        alt="Post content"
                      />
                    </AspectRatio>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="gap-2 text-gray-600 hover:text-red-500"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-red-500 stroke-red-500" : ""
                    }`}
                  />
                  <span>{likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommentClick(post.id)}
                  className="gap-2 text-gray-600 hover:text-blue-500"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.commentsCount || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 text-gray-600 hover:text-green-500"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </Button>
              </div>

              <Link to="/post/feed">
                <Button variant="outline" size="sm">
                  Back to Feed
                </Button>
              </Link>
            </div>

            {showComments && selectedPostId && (
              <CommentComponent
                onClose={() => setShowComments(false)}
                postId={selectedPostId as unknown as number}
              />
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-[400px] w-full" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GetPostById;
