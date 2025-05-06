import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import PostContent from "../../components/Posts";

// Define the type for the Post object
interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}


const GetPostByIdForUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string>("");

  const myFunction = () => {
    let url = `http://localhost:5173/post/${id}/all`
    navigator.clipboard.writeText(url)
    alert("Link copied to clipbaord")
  }



  useEffect(() => {
    axios
      .get<Post>(`http://localhost:8080/api/posts2/${id}`)
      .then((response) => setPost(response.data))
      .catch((error) => setError("Post not found"));

      
  }, [id]);

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;
  }
  else{
    console.log(post)
  }
  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      {post ? (
        <>
          <h2>{post.title}</h2> {post.content}
          
          {/* <PostContent content = {post.content}/> */}

          {post.imageUrl == null ? <p>no image</p> : (

            post.imageUrl &&


              post.imageUrl.length > 50 ? (        //This is about multiple images
              post.imageUrl.split(",").map((filename, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:8080/images/${filename.trim()}`}
                  alt={`Post ${post.id} - ${idx}`}
                  style={{ width: "100%", maxWidth: "400px" }}
                />
              ))
            ) : (
              post.imageUrl.length == 40 ? (     //This is about images who went through 1 "Edit" cycle and lost it's '.\uploads' thing  in it's '.\uploads\15few-4de...'. Ie, when go through Update.jsx
                <img
                  // key={idx}
                  src={`http://localhost:8080/images/${post.imageUrl}`}
                  // alt={`Post ${post.id} - ${idx}`}
                  style={{ width: "100%", maxWidth: "400px" }}
                />
              ) :
                (   //This is about images who are freshly created. Ie, they did not go through Update.jsx
                  post.imageUrl && <img src={`http://localhost:8080/images/${post.imageUrl.split('\\').pop()}`} alt="Post" style={{ width: "100%", maxWidth: "400px" }} />
                )
            )









          )}









          <br />
          {/* <Link to="/posts"><button style={{ marginTop: "20px" }}>Share</button></Link> */}
          <Link to="/post/feed"><button style={{ marginTop: "20px" }}>Back to Posts</button></Link>
          <p></p>
          <button onClick={myFunction}>Share</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GetPostByIdForUsers;
