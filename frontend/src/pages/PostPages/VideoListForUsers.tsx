import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

const VideoListForUsers: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  
 

  useEffect(() => {
    axios.get<Video[]>('http://localhost:8080/videos')
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
      console.log(videos)
  }, []);

  const deleteVideo = (id: number) => {
    axios.delete(`http://localhost:8080/videos/${id}`)
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
                    className=''
                >
                    <source src={video.videoUrl.split('.\\frontend\\public').pop()} type="video/mp4" />
                    
                    Your browser does not support the video tag.
                </video>

                
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoListForUsers;
