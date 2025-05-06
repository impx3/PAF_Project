import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/pages/dashboard/DashboardPage";

import Followers from "@/pages/Followers";
import DeleteAccount from "@/pages/DeleteAccount";
import EditProfile from "@/pages/EditProfile";
import UserList from "@/pages/UserList";
import PrivateRoute from "@/routes/PrivateRoute";
import { HomePage } from "@/pages/HomePage.tsx";
import { Profile } from "@/pages/Profile.tsx";
import Login from "@/pages/Login.tsx";
import Register from "@/pages/Register.tsx";
import { TestProfile } from "@/pages/TestProfile.tsx";
import PublicLearningPlans from "@/pages/PublicLearningPlans.tsx";
import PublicLearningPlanResources from "@/pages/PublicLearningPlanResources.tsx";
import LearningPlansDashboard from "@/pages/LearningPlansDashboard.tsx";
import LearningPlanResources from "@/pages/LearningPlanResources.tsx";
import {
  CreateWithMultipleImages,
  GetAllPosts,
  GetAllPostsForUsers,
  GetPostById,
  VideoList,
  VideoListForUsers,
  VideoUploadForm,
} from "@/pages/PostPages";

export function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public landing/login */}
        <Route path="/" element={<HomePage />} />
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
            <Route index element={<Navigate to="home" replace />} />

            {/* your nested pages */}
            <Route path="home" element={<HomePage />} />
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
            {/* <Route path={"post/createpostselect"} element={<PostHome/>}/>
              <Route path={"post/create"} element={<CreatePost/>}/>*/}
            <Route
              path={"post/CreateWithMultipleImages"}
              element={<CreateWithMultipleImages />}
            />
            {/* <Route path={"post/update/:id"} element={<UpdatePost/>}/>
              <Route path={"post/delete/:id"} element={<DeletePost/>}/>*/}
            <Route path={"post/createvid"} element={<VideoUploadForm />} />
            <Route path={"post/feed"} element={<GetAllPostsForUsers />} />
            <Route path={"post/videos"} element={<VideoList />} />
            <Route path={"post/feedvideo"} element={<VideoListForUsers />} />
            <Route path={"post/:id"} element={<GetPostById />} />
            {/* catch-all for “/anything-else” inside dashboard */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
