import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className=''><h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Choose type of post to create</h2>
    <br/>
    <Link to="/post/text"><button 
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg p-10 mb-10"
    >Create text post</button></Link>
    
    <br/>
    <Link to="/post/create"><button 
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg p-10 mb-10"
    >Create 1 post</button></Link>
    <br/>
    <Link to="/post/CreateWithMultipleImages"><button 
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg p-10 mb-10"
    >Create 1 post with many photos</button></Link>

    <br/>
    <Link to="/post/createvid"><button 
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg p-10 mb-10"
    >Create video</button></Link>
    </div>
  )
}

export default Home