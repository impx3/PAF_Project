import { useRef, useEffect, useState } from "react";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { CommentComponent } from "@/components/comment/comment.tsx"; // Adjust the import path as needed

const dummyVideos = [
  {
    id: 1,
    title: "Short 1",
    content: "Check out this cool short!",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "Short 2",
    content: "Another awesome short video!",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 3,
    title: "Short 3",
    content: "Don’t miss this one!",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export const HomePage = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleMessageClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    setShowComments(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.isIntersecting) {
            video?.play();
          } else {
            video?.pause();
          }
        });
      },
      {
        threshold: 0.8,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    containerRefs.current.forEach((container) => {
      if (container) observer.observe(container);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-black">
      {dummyVideos.map((video, idx) => (
        <div
          key={video.id}
          ref={(el) => {
            containerRefs.current[idx] = el;
          }}
          className="h-screen w-full flex items-center justify-center snap-start"
        >
          <div className="w-full md:w-[30%] flex flex-col items-center justify-center relative px-4">
            <div
              className="w-full aspect-[9/16] relative cursor-pointer"
              onClick={() => {
                const video = videoRefs.current[idx];
                if (video?.paused) video.play();
                else video?.pause();
              }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={video.videoUrl}
                loop
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Video Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h2 className="text-lg md:text-xl font-bold mb-1 text-white">
                  {video.title}
                </h2>
                <p className="text-sm md:text-base text-gray-200">
                  {video.content}
                </p>
              </div>
            </div>

            {/* Side Buttons */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 md:space-y-6">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
              <button
                className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all"
                onClick={() => handleMessageClick(video.id)}
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-all">
                <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* Comment Panel */}
      {showComments && (
        <CommentComponent
          onClose={() => setShowComments(false)}
          postId={selectedVideoId as number}
        />
      )}
    </div>
  );
};
