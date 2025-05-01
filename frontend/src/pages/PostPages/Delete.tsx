import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Delete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      axios.delete(`http://localhost:8080/api/posts/${id}`)
        .then(() => {
          alert("Post deleted successfully!");
          navigate("/post/posts");
        })
        .catch(error => {
          alert("Error deleting post.");
          console.error(error);
        });
    } else {
      navigate("/post/posts");
    }
  }, [id, navigate]);

  return <p>Deleting post...</p>;
};

export default Delete;
