import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { EllipsisVertical, Trash2 } from "lucide-react";

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

const VideoListForUsers: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<Video[]>("http://localhost:8080/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteVideo = (id: number) => {
    axios
      .delete(`http://localhost:8080/videos/${id}`)
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
          <li
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoListForUsers;
