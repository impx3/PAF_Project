import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const VideoUploadForm: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
const navigate = useNavigate();
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

    if (!videoFile || !title || !description) {
      setMessage('Please fill all fields and choose a video.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
        console.log(formData)
        // const response = await axios.get("http://localhost:8080/videos/home")
      const response = await axios.post<{ content: string }>("http://localhost:8080/videos", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    console.log("Response",response.data)
      setMessage('Upload successful!');
      const videoLink = response.data.content?.split(' ').pop() || ''; // extract URL if returned
      setVideoUrl(videoLink);
      navigate('/post/videos');
      
    } catch (error: any) {
      //   console.error(error);
    //   setMessage(error.response?.data?.content || 'Upload failed');
    }
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };


  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg rounded-xl mt-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Upload Short Video (Max 30 seconds)</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Video File</label>
          <input
            type="file"
            accept="video/mp4,video/mov"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      {message && <p className="mt-4 text-center text-lg text-gray-700">{message}</p>}

      {videoUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">Uploaded Video Preview:</h4>
          <video src={videoUrl} controls className="w-full rounded-md shadow" />
        </div>
      )}
    </div>
  );
};

export default VideoUploadForm;