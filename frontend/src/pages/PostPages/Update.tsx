import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "@/utils/axiosConfig.ts";

// Type for URL params
interface RouteParams {
  id: string;
}

const Update: React.FC = () => {
  const { id } = useParams() as unknown as RouteParams;
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [imageURLInCase, setimageURLInCase] = useState<string>("");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setPreview(
          `http://localhost:8080/images/${response.data.imageUrl.split("\\").pop()}`,
        );

        let imageurlincaseTemp = `${response.data.imageUrl.split("\\").pop()}`;

        setimageURLInCase(imageurlincaseTemp);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
    console.log(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    formData.append("imageURLinCaseUserDidnotREUPLOAD", imageURLInCase);

    try {
      const token = localStorage.getItem("token");

      await api.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Post updated successfully!");
      navigate("/posts");
    } catch (error) {
      setMessage("Error updating post.");
      console.error(error);
    }
  };

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>Update Post</h2>
      title is{title}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Preview" style={{ width: "100px" }} />
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Update;
