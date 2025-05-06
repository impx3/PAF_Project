import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Submit from "@/components/PostComponents/Submit";

const CreateWithMultipleImages: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    // const file = event.target.files[0];
    // console.log("file", file)
    const files = Array.from(event.target.files || []).slice(0, 3); // limit to 3 files
    const fileArray = files as File[];

    setImages(fileArray);
    

    // Generate previews
    const previewUrls = fileArray.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
    // console.log("previews",previews)
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("images", images)
    console.log("title",title)
    console.log("content",content)
    console.log("previewUrls",previews)

    const formData = new FormData();
    console.log("formData before addding",formData)

    formData.append("title", title);
    formData.append("content", content);
    
    console.log("formData",formData)

    images.forEach((img, idx) => {
      formData.append("images", img); // name must match backend
    });
    

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:8080/api/posts/multi", formData, {
        headers: { "Content-Type": "multipart/form-data",
                   'Authorization': `Bearer ${token}`
        },
      });

      navigate("/post/posts");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Post with Multiple Images</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input className="w-full border p-2 rounded" type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2 rounded" value={content} placeholder="Content" onChange={(e) => setContent(e.target.value)} required />
        
        <input
        className="w-full border p-2 rounded"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "10px 0" }}>
          {previews.map((src, idx) => (
            <img key={idx} src={src} alt={`Preview ${idx}`} style={{ width: "80px", height: "80px" }} />
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default CreateWithMultipleImages;
