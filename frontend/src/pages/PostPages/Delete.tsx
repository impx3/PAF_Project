import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "@/utils/axiosConfig.ts";

const Delete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (confirmDelete) {
      //bruh rule 1: dont hard code apis i removed them

      api
        .delete(`/posts/${id}`)
        .then(() => {
          alert("Post deleted successfully!");
          navigate("/posts");
        })
        .catch((error) => {
          alert("Error deleting post.");
          console.error(error);
        });
    } else {
      navigate("/posts");
    }
  }, [id, navigate]);

  return <p>Deleting post...</p>;
};

export default Delete;
