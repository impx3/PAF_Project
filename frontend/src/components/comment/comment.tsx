import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/utils/axiosConfig.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { convertDateToTimeAgo } from "@/utils/dateUtils.ts";
import { Trash2, Pencil, EllipsisVertical } from "lucide-react";
import { LikeComponent } from "@/components/like/like.tsx";

export type CommentResponse = {
  commentId: number;
  postId: number;
  createdUserId: number;
  createdUserName: string;
  commentBody: string;
  profileImage: string;
  likeCount: number;
  isLiked: boolean;
  updatedAt: string;
};

type CommentRequest = {
  userId: number;
  postId: number;
  commentBody: string;
};

export const CommentComponent = ({
  onClose,
  postId,
}: {
  onClose: () => void;
  postId: number;
}) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [newComment, setNewComment] = useState<CommentRequest>({
    userId: Number(currentUser?.id),
    postId: postId, // Replace with actual postId if needed
    commentBody: "",
  });

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}`);

      setComments(res.data.result);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments().then();
  }, [currentUser]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment({
      ...newComment,
      commentBody: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!newComment.commentBody) return;
    if (editingCommentId) {
      try {
        await api.put(`/comments/update/${editingCommentId}`, {
          commentBody: newComment.commentBody,
        });
        fetchComments().then();
        setEditingCommentId(null);
        setNewComment({
          ...newComment,
          commentBody: "",
        });
      } catch (error) {
        console.error("Failed to edit comment", error);
      }
    } else {
      try {
        await api.post(`/comments/add`, newComment);
        fetchComments().then();

        setNewComment({
          ...newComment,
          commentBody: "",
        });
      } catch (err) {
        console.error("Failed to post comment", err);
      }
    }
  };

  const handlePostDelete = async (comment: CommentResponse) => {
    try {
      if (currentUser?.id == comment.createdUserId) {
        await api.delete(`/comments/delete/${comment?.commentId}`);
        fetchComments().then();
      }
    } catch (e) {
      console.error("Failed to delete comment", e);
    }
  };

  const handleEditClick = (comment: CommentResponse) => {
    setEditingCommentId(comment.commentId);
    setNewComment({
      userId: Number(currentUser?.id),
      postId: postId,
      commentBody: comment.commentBody,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-white p-4 border-l border-gray-800 animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Comments</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Comment List */}
        <div className="h-[calc(100%-120px)] overflow-y-auto space-y-6 pr-2">
          {comments?.map((comment, index) => (
            <div key={index} className="flex gap-3">
              <img
                src={comment?.profileImage || "/default-avatar.png"}
                alt={comment?.createdUserName}
                className="h-10 w-10 min-w-[2.5rem] rounded-full object-cover object-center border-2 border-black"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 text-xs font-medium text-white bg-gray-400 rounded-full ">
                    @{comment?.createdUserName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment?.updatedAt &&
                      convertDateToTimeAgo(comment?.updatedAt)}
                  </span>
                  {currentUser?.id === comment.createdUserId && (
                    <div className="relative ml-auto">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === comment.commentId
                              ? null
                              : comment.commentId,
                          )
                        }
                        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </button>

                      {openMenuId === comment.commentId && (
                        <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10">
                          <button
                            onClick={() => {
                              handleEditClick(comment);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handlePostDelete(comment).then();
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex gap-2 items-center">
                  <p className="text-gray-800 leading-relaxed">
                    {comment?.commentBody}
                  </p>
                  {/* Like component */}
                  <div className="mt-1 flex items-center gap-1">
                    <LikeComponent
                      comment={comment}
                      initialLikes={comment.likeCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-white-100">
          <div className="flex gap-3 ">
            <img
              src={currentUser?.profileImage || "/default-avatar.png"}
              alt={currentUser?.username}
              className="h-10 w-10 min-w-[2.5rem] rounded-full object-cover object-center border-2 border-black"
            />

            <div className="w-full">
              <input
                value={newComment.commentBody}
                onChange={handleCommentChange}
                placeholder={
                  editingCommentId ? "Edit your comment..." : "Add a comment..."
                }
                className="w-full bg-transparent border-b border-gray-400 text-black focus:outline-none focus:border-black focus:border-b-2 placeholder-gray-400"
              />

              {/* Buttons under input */}
              {newComment.commentBody.trim() !== "" && (
                <div className="flex justify-end mt-2 space-x-3">
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setNewComment({ ...newComment, commentBody: "" });
                    }}
                    className="px-4 text-sm font-medium text-black rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      editingCommentId
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {editingCommentId ? "Update" : "Post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
