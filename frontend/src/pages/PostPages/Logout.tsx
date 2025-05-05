import { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout: React.FC = () => {
 const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
       
       try {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/post/login');

       } catch (error) {
        console.error('Logout failed', error);
       }
     };
   


 return (
   <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
     
       <button type="submit">Logout</button>
     </form>
   </div>
 );
  }




export default Logout