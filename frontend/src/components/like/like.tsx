import api from "@/utils/axiosConfig.ts";
import { Heart } from "lucide-react";
import { useState } from "react";
import { CommentResponse } from "@/components/comment/comment.tsx";

// LikeComponent.tsx
export const LikeComponent = ({
  comment,
  initialLikes,
}: {
  comment: CommentResponse;
  initialLikes: number;
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikes = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!comment) return;
      // Send request to backend
      const response = await api.post(`/comments/like/${comment?.commentId}`);

      comment.isLiked = !comment.isLiked;

      // Update with ACTUAL value from backend response
      setLikes(response.data.result.likeCount); // Adjust based on your API response structure
    } catch (err) {
      console.error("Failed to like", err);
      // Optional: Show error to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleLikes}
        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
        disabled={isLoading}
      >
        {comment?.isLiked ? (
          <Heart className="text-red-500 fill-red-500 w-4 h-4" />
        ) : (
          <Heart className="w-4 h-4 text-red-500" />
        )}
      </button>
      <span className="text-sm text-gray-500">{likes}</span>
    </div>
  );
};
