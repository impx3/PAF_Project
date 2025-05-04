import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define the Post type
interface Post {
  id: number;
  
  title: string;
  content: string;
  imageUrl: string;
}

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZSIsImlkIjoxLCJlbWFpbCI6ImVtYWlsMDkwM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsInVzZXJuYW1lIjoidXNlcm5hbWUiLCJpYXQiOjE3NDYzMzcwODQsImV4cCI6MTc0NjM0MDY4NH0.fYqXLdxYzTrMMuFAAylUBym_p-NwVxWGJknxtap8uH4'

const GetAllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [toupdateposts, settoupdateposts] = useState<number>(0);



  useEffect(() => {
    axios.get("http://localhost:8080/api/posts", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
      
    )
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));   

  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>All Posts</h2>
      {posts.length === 0 ? <p>No posts available.</p> : (
        posts.map(post => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {/* Display each image */}
            { post.imageUrl === null ? <p>No image</p> : 
          

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                {post.imageUrl &&
                
                post.imageUrl.length > 50 ? (        //This is about multiple images
                  post.imageUrl.split(",").map((filename, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8080/images/${filename.trim()}`}
                      alt={`Post ${post.id} - ${idx}`}
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                    />
                  ))
                ) : (
                  post.imageUrl.length == 40 ? (     //This is about images who went through 1 "Edit" cycle and lost it's '.\uploads' thing  in it's '.\uploads\15few-4de...'. Ie, when go through Update.jsx
                    <img
                      // key={idx}
                      src={`http://localhost:8080/images/${post.imageUrl}`}
                      // alt={`Post ${post.id} - ${idx}`}
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                    />
                  )  : 
                  (   //This is about images who are freshly created. Ie, they did not go through Update.jsx
                    post.imageUrl && <img src={`http://localhost:8080/images/${post.imageUrl.split('\\').pop()}`} alt="Post" style={{ width: "100px" }} />
                  )
                )

                
                
                
                }
                </div>


            }


            {/* {post.imageUrl && <img src={`http://localhost:8080/images/${post.imageUrl.split('\\').pop()}`} alt="Post" style={{ width: "100px" }} />} */}


            <div>
              <Link to={`/post/update/${post.id}`}><button>Edit</button></Link>
              <Link to={`/post/delete/${post.id}`}><button style={{ marginLeft: "10px", color: "red" }}>Delete</button></Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GetAllPosts;
