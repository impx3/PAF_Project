import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
 // State for title, content, and image
 const [title, setTitle] = useState<string>("");
 const [content, setContent] = useState<string>("");
 const [image, setImage] = useState<File | null>(null);
 const [preview, setPreview] = useState<string | null>(null);
 const [message, setMessage] = useState<string>("");
 const navigate = useNavigate();
 
 // Handle form submission
 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

   
   try {
     const response = await axios.post("http://localhost:8080/api/auth/login", {
        "username":"username",
        "password":"password"
    });
    const token = response.data.result.token; // assume backend sends { token: "..." }
    // console.log(response)
    console.log(token, "----")
    localStorage.setItem('token', token);

    // Set Authorization header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    console.log('Login successful!');
   } catch (error) {
    console.error('Login failed', error);
   }
 };

 return (
   <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
     <h2>Create Post</h2>
     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

       <button type="submit">Submit</button>
     </form>
   </div>
 );
}

export default Login