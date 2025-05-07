import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export const Login: React.FC = () => {
const [username, setUsername] = useState<string>("");
const [password, setPassword] = useState<string>("password");
 
 // Handle form submission
 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

   
   try {
     const response = await axios.post("http://localhost:8080/api/auth/login", {
        "username":username,
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
     <h2>Login</h2>
     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
     <input
         type="text"
         placeholder="us"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         required
       />
       <input
         type="text"
         placeholder="pass"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
       />
       <button type="submit">Login</button>
     </form>
   </div>
 );
}

export default Login