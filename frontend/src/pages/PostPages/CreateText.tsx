import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreateText: React.FC = () => {
 // State for title, content, and image
 const [title, setTitle] = useState<string>("");
 const [content, setContent] = useState<string>("");
 const [message, setMessage] = useState<string>("");

 const navigate = useNavigate();
 
 


 // Handle form submission
 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

   if (!title || !content ) {
     setMessage("Please fill all fields and select an image.");
     return;
   }

   const formData = new FormData();
   console.log("formData before addding",formData)


   formData.append("title", title);
   formData.append("content", content);
   console.log("formData",formData)
   
   try {
     const response = await axios.post("http://localhost:8080/api/posts/text", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
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
     <h2>Create Post</h2>
     {message && <p style={{ color: "red" }}>{message}</p>}
     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
       <input
         type="text"
         placeholder="Title"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         required
       />
       <textarea
         placeholder="Content"
         value={content}
         onChange={(e) => setContent(e.target.value)}
         required
       />

       <button type="submit">Submit</button>
     </form>
   </div>
 );
}

export default CreateText