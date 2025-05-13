import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/pages/dashboard/DashboardPage";

import Followers from "@/pages/Followers";
import DeleteAccount from "@/pages/DeleteAccount";
import EditProfile from "@/pages/EditProfile";
import UserList from "@/pages/UserList";
import PrivateRoute from "@/routes/PrivateRoute";

import { Profile } from "@/pages/Profile.tsx";
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import { TestProfile } from "@/pages/TestProfile.tsx";
import PublicLearningPlans from "@/pages/PublicLearningPlans.tsx";
import PublicLearningPlanResources from "@/pages/PublicLearningPlanResources.tsx";
import LearningPlansDashboard from "@/pages/LearningPlansDashboard.tsx";
import LearningPlanResources from "@/pages/LearningPlanResources.tsx";
import {
  Create,
  CreateWithMultipleImages,
  Delete,
  GetAllPosts,
  GetAllPostsForUsers,
  GetPostById,
  Home,
  Update,
  VideoList,
  VideoListForUsers,
  VideoUploadForm,
} from "@/pages/PostPages";
import CreateText from "@/pages/PostPages/CreateText";
import GetPostByIdForUsers from "@/pages/PostPages/GetPostByIdForUsers";

export function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public landing/login */}
        {/* <Route index path="/" element={<GetAllPostsForUsers />} />*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path={"/learningplans/public"}
          element={<PublicLearningPlans />}
        />
        <Route
          path={"/learningplans/public/:planId"}
          element={<PublicLearningPlanResources />}
        />

        {/* everything inside here requires auth */}
        <Route element={<PrivateRoute />}>
          {/* DashboardLayout wraps all the “/home”, “/profile”, etc */}
          <Route path="/" element={<DashboardPage />}>
            {/* redirect “/” → “/home” */}
            <Route index element={<Navigate to="posts" replace />} />
            {/* your nested pages */}
            {/*   <Route path="home" element={<HomePage />} />*/}
            <Route path="profile/" element={<Profile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="explore" element={<UserList />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="followers" element={<Followers />} />
            <Route path="delete-account" element={<DeleteAccount />} />
            <Route path="chat" element={<TestProfile />} />
            <Route
              path={"learning-plans"}
              element={<LearningPlansDashboard />}
            />
            <Route
              path={"learning-plans/:planId/resources"}
              element={<LearningPlanResources />}
            />
            <Route path={"post/posts"} element={<GetAllPosts />} />
            <Route path={"post/createpostselect"} element={<Home />} />
            <Route path={"post/create"} element={<Create />} />
            <Route path={"post/text"} element={<CreateText />} />
            <Route
              path={"post/CreateWithMultipleImages"}
              element={<CreateWithMultipleImages />}
            />

            <Route index path={"post/feed"} element={<GetAllPostsForUsers />} />
            <Route path={"post/feedvideo"} element={<VideoListForUsers />} />
            <Route path={"post/:id/all"} element={<GetPostByIdForUsers />} />

            <Route path={"post/update/:id"} element={<Update />} />
            <Route path={"post/delete/:id"} element={<Delete />} />
            <Route path={"post/createvid"} element={<VideoUploadForm />} />
            <Route path={"post/videos"} element={<VideoList />} />
            
            <Route path={"post/:id"} element={<GetPostById />} />
            {/* catch-all for “/anything-else” inside dashboard */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
