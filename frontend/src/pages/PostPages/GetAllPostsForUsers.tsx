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

const GetAllPostsForUsers: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);


  useEffect(() => {
    axios.get<Post[]>("http://localhost:8080/api/posts2/foraudience")
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));   

      
  }, []);

  return (
    
       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">All Posts</h2>
        {/* <p>Tip: You don't have to refresh the page. If new post came or a current post was updated, you will get it without refresh page</p> */}
      <div className="space-y-8">
      {posts.length === 0 ?  <p className="text-center text-gray-500">No posts available.</p> : (
        posts.map(post => (
          <div key={post.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 ml-8 mt-3">{post.title}</h3>
            <p className="text-gray-600 mb-4 ml-8 mt-3">{post.content}</p>

            {/* Display each image */}
            { post.imageUrl === null ? <p></p> : 
            
            <div 
             className="flex flex-wrap gap-4 justify-center mb-4">
            
                {post.imageUrl &&
                
                post.imageUrl.length > 50 ? (        //This is about multiple images
                  post.imageUrl.split(",").map((filename, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8080/images/${filename.trim()}`}
                      alt={`Post ${post.id} - ${idx}`}
                      style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                    />
                  ))
                ) : (
                  post.imageUrl.length == 40 ? (     //This is about images who went through 1 "Edit" cycle and lost it's '.\uploads' thing  in it's '.\uploads\15few-4de...'. Ie, when go through Update.jsx
                    <img
                      // key={idx}
                      src={`http://localhost:8080/images/${post.imageUrl}`}
                      // alt={`Post ${post.id} - ${idx}`}
                      style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                    />
                  )  : 
                  (   //This is about images who are freshly created. Ie, they did not go through Update.jsx
                    post.imageUrl && <img src={`http://localhost:8080/images/${post.imageUrl.split('\\').pop()}`} alt="Post" style={{ maxWidth: "200px", maxHeight: "200px"}} />
                  )
                )

           


                
                
                
                }
              </div>

              }
              <Link to={`/post/${post.id}/all`}><button className="text-gray-600 mb-4 ml-8 mt-3">View</button></Link>


          </div>
        ))
      )}
      </div>
    </div>
    
  );
   
}

export default GetAllPostsForUsers