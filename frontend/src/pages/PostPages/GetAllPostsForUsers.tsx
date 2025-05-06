import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import api from "@/utils/axiosConfig.ts";

// Define the Post type

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

const GetAllPostsForUsers: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api
      .get<Post[]>("/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [posts]);

  return (
    <div
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>All Posts</h2>
      <p>
        Tip: You don't have to refresh the page. If new post came or a current
        post was updated, you will get it without refresh page
      </p>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {/* Display each image */}
            {post.imageUrl === null ? (
              <p></p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {post.imageUrl && post.imageUrl.length > 50 ? ( //This is about multiple images
                  post.imageUrl
                    .split(",")
                    .map((filename, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:8080/images/${filename.trim()}`}
                        alt={`Post ${post.id} - ${idx}`}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ))
                ) : post.imageUrl.length == 40 ? ( //This is about images who went through 1 "Edit" cycle and lost it's '.\uploads' thing  in it's '.\uploads\15few-4de...'. Ie, when go through Update.jsx
                  <img
                    // key={idx}
                    src={`http://localhost:8080/images/${post.imageUrl}`}
                    // alt={`Post ${post.id} - ${idx}`}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  //This is about images who are freshly created. Ie, they did not go through Update.jsx
                  post.imageUrl && (
                    <img
                      src={`http://localhost:8080/images/${post.imageUrl.split("\\").pop()}`}
                      alt="Post"
                      style={{ width: "100px" }}
                    />
                  )
                )}
              </div>
            )}
            <Link to={`/post/${post.id}`}>
              <button style={{ marginTop: "20px" }}>View</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default GetAllPostsForUsers;
