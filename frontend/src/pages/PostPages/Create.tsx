import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Submit from "@/components/PostComponents/Submit";

const Create: React.FC = () => {
 // State for title, content, and image
 const [title, setTitle] = useState<string>("");
 const [content, setContent] = useState<string>("");
 const [image, setImage] = useState<File | null>(null);
 const [preview, setPreview] = useState<string | null>(null);
 const [message, setMessage] = useState<string>("");
 const navigate = useNavigate();
 
 
 // Handle image selection
 const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {

  setImage(file);
  setPreview(URL.createObjectURL(file)); // Show preview
  }
 };




  // Cleanup URL object when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview])





 // Handle form submission
 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

   if (!title || !content || !image) {
     setMessage("Please fill all fields and select an image.");
     return;
   }

   const formData = new FormData();
   console.log("formData before addding",formData)

  

   formData.append("title", title);
   formData.append("content", content);
   formData.append("image", image);
   console.log("formData",formData)
   
   try {
     const token = localStorage.getItem('token');
     const response = await axios.post("http://localhost:8080/api/posts", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
         'Authorization': `Bearer ${token}`
       },
     });

     setMessage("Post created successfully!");
     navigate('/post/posts');
     console.log(response.data);
   } catch (error) {
     setMessage("Error creating post.");
     console.error(error);
   }
 };

 return (
   <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
     <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Create Post</h2>
     {message && <p style={{ color: "red" }}>{message}</p>}
     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
       <input
         type="text"
          className="w-full border p-2 rounded"
          
         placeholder="Title"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         required
       />
       <textarea
         placeholder="Content"
          className="w-full border p-2 rounded"
          
         value={content}
         onChange={(e) => setContent(e.target.value)}
         required
       />
       <input type="file" 
        className="w-full border p-2 rounded"
        accept="image/*" onChange={handleImageChange} required />
       {preview && <img src={preview} alt="Preview" style={{ width: "100px", margin: "10px auto" }} />}
       <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>
     </form>
   </div>
 );
}

export default Create