import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import LearningPlanSelectionModal from "../../components/ui/LearningPlanSelectionModal";

// Define the Post type
interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}


const GetAllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:8080/api/posts/user", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
      
    )
      .then(response => setPosts(response.data))
      .catch(error => console.error("Error fetching posts:", error));   
  }, []);


  const handleSaveClick = (post: Post) => {
    setSelectedPost(post);
    setShowSaveModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">All Posts</h2>
        
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            posts.map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                    <button
                      onClick={() => handleSaveClick(post)}
                      className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Save to Learning Plan"
                    >
                      <FaBookmark className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{post.content}</p>

                  {/* Display images */}
                  {post.imageUrl && (
                    <div className="flex flex-wrap gap-4 justify-center mb-4">
                      {post.imageUrl.length > 50 ? (
                        post.imageUrl.split(",").map((filename, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:8080/images/${filename.trim()}`}
                            alt={`Post ${post.id} - ${idx}`}
                            className="rounded-lg shadow-sm max-w-[200px] max-h-[200px] object-cover"
                          />
                        ))
                      ) : post.imageUrl.length === 40 ? (
                        <img
                          src={`http://localhost:8080/images/${post.imageUrl}`}
                          alt={`Post ${post.id}`}
                          className="rounded-lg shadow-sm max-w-[200px] max-h-[200px] object-cover"
                        />
                      ) : (
                        post.imageUrl && (
                          <img 
                            src={`http://localhost:8080/images/${post.imageUrl.split('\\').pop()}`} 
                            alt="Post"
                            className="rounded-lg shadow-sm max-w-[200px] max-h-[200px] object-cover"
                          />
                        )
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <Link 
                      to={`/post/update/${post.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/post/delete/${post.id}`}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {selectedPost && (
          <LearningPlanSelectionModal
            isOpen={showSaveModal}
            onClose={() => {
              setShowSaveModal(false);
              setSelectedPost(null);
            }}
            postTitle={selectedPost.title}
            postContent={selectedPost.content}
            postUrl={`http://localhost:3000/post/${selectedPost.id}`}
          />
        )}
      </div>
    </div>
  );
};

export default GetAllPosts;
