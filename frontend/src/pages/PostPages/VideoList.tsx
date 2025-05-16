import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/utils/axiosConfig';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  
 

  useEffect(() => {
    api.get<Video[]>('/videos')
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
      console.log(videos)
  }, []);

  const deleteVideo = (id: string) => {
    api.delete(`/videos/${id}`)
      .then(() => {
        setVideos(videos.filter(video => video.id !== id));
      })
      .catch(err => console.error(err));
      

  };

  return (
    <div >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">All Videos</h2>


      <ul className="space-y-4">
        {videos.map(video => (
          <li key={video.id} className="bg-white p-4 shadow rounded">
            <h3 >{video.title}</h3>
            <p>{video.description}</p>

                <video
                    width="340"
                    height="260"
                    controls
                    poster="/videos/poster.jpg"
                    style={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', marginTop: '12px', marginLeft: '30%',  marginBottom: '10px' }}
                >
                    <source src={video.videoUrl.split('.\\frontend\\public').pop()} type="video/mp4" />
                    
                    Your browser does not support the video tag.
                </video>

            <div >
              <button
                onClick={() => deleteVideo(video.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors ml-200"
              >
                Delete
              </button>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
