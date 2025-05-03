import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage.tsx";
import Profile from "@/pages/Profile.tsx";
import DashboardPage from "@/pages/dashboard/DashboardPage.tsx";
import Home from "@/pages/PostPages/Home";
import Create from "@/pages/PostPages/Create";
import GetAllPosts from "@/pages/PostPages/GetAllPosts";
import CreateWithMultipleImages from "@/pages/PostPages/CreateWithMultipleImages";
import Update from "@/pages/PostPages/Update";
import Delete from "@/pages/PostPages/Delete";
import VideoUploadForm from "@/pages/PostPages/VideoUploadForm";
import GetAllPostsForUsers from "@/pages/PostPages/GetAllPostsForUsers";
import VideoList from "@/pages/PostPages/VideoList";
import VideoListForUsers from "@/pages/PostPages/VideoListForUsers";
import GetPostById from "@/pages/PostPages/GetPostById";

export const AppRouting = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<HomePage />} />
      <Route path={"/profile"} element={<Profile />} />
      <Route path={"/dashboard"} element={<DashboardPage />} />

      <Route path={"/post/createpostselect"} element={<Home />} />
      <Route path={"/post/create"} element={<Create />} />
      <Route path={"/post/posts"} element={<GetAllPosts />} />
      <Route path="/post/CreateWithMultipleImages" element={<CreateWithMultipleImages />} />
      <Route path="/post/update/:id" element={<Update />} />
      <Route path="/post/delete/:id" element={<Delete />} />

      <Route path="/post/createvid" element={<VideoUploadForm />} />

      <Route path="/post/feed" element={<GetAllPostsForUsers />} />
      <Route path="/post/videos" element={<VideoList />} />

      <Route path="/post/feedvideo" element={<VideoListForUsers />} />
      <Route path="/post/:id" element={<GetPostById />} />

    </Routes>
  );
};
