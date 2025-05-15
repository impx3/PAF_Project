import React, { useEffect, useState, useRef } from "react";
import {
  EllipsisVertical,
  Trash2,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CommentComponent } from "@/components/comment/comment.tsx";
import api from "@/utils/axiosConfig.ts";

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  likeCount: number;
  isLiked: boolean;
  commentsCount: number;
}

const VideoListForUsers: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleLike = async (videoId: number) => {
    try {
      const response = await api.post(`/videos/like/${videoId}`);
      const updatedVideo = response.data.result;

      // Update the video in the local state
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === updatedVideo.id ? updatedVideo : video,
        ),
      );
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleCommentClick = (videoId: number) => {
    // Handle comment click logic here
    setSelectedVideoId(videoId);
    setShowComments(true);
  };

  const handleShare = (videoId: number) => {
    // Handle share logic here
    console.log(`Share clicked for video ID: ${videoId}`);
  };

  useEffect(() => {
    api
      .get<Video[]>("/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteVideo = (id: number) => {
    api
      .delete(`/videos/${id}`)
      .then(() => {
        setVideos(videos.filter((video) => video.id !== id));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-10">Videos</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col gap-4 relative"
          >
            {/* 3-dot vertical menu */}
            <div className="absolute top-4 right-4" ref={menuRef}>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={() =>
                  setOpenMenuId(openMenuId === video.id ? null : video.id)
                }
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>

              {openMenuId === video.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              {video.title}
            </h3>
            <p className="text-gray-600">{video.description}</p>

            <div className="relative w-full h-60 overflow-hidden rounded-xl shadow">
              <video
                controls
                poster="/videos/poster.jpg"
                className="w-full h-full object-cover rounded-xl"
              >
                <source
                  src={video.videoUrl.split(".\\frontend\\public").pop()}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            <CardFooter className="flex justify-between items-center px-0 py-2">
              <div className="flex gap-1 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(video.id)}
                  className="flex-1 gap-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg px-2 py-1"
                >
                  {video?.isLiked ? (
                    <Heart className="text-red-500 fill-red-500 w-4 h-4" />
                  ) : (
                    <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  )}
                  <span className="text-sm font-medium">{video.likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommentClick(video?.id)}
                  className="flex-1 gap-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-lg px-2 py-1"
                >
                  <MessageCircle className="w-4 h-4 text-gray-500 hover:text-blue-500" />
                  <span className="text-sm font-medium">
                    {video?.commentsCount}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(video.id)}
                  className="flex-1 gap-2 text-gray-600 hover:text-green-500 hover:bg-gray-100 rounded-lg px-2 py-1"
                >
                  <Share2 className="w-4 h-4 text-gray-500 hover:text-green-500" />
                  <span className="text-sm font-medium">Share</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        {showComments && selectedVideoId && (
          <CommentComponent
            onClose={() => setShowComments(false)}
            videoId={selectedVideoId}
          />
        )}
      </ul>
    </div>
  );
};

export default VideoListForUsers;
