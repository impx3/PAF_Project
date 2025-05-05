
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import MainLayout from "../layouts/MainLayout";


// Page Imports
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Followers from "../pages/Followers";
import EditProfile from "../pages/EditProfile";
import DeleteAccount from "../pages/DeleteAccount";
import UserList from "../pages/UserList";
import PublicLearningPlans from "../pages/PublicLearningPlans";
import PublicLearningPlanResources from "../pages/PublicLearningPlanResources";
import LearningPlansDashboard from "../pages/LearningPlansDashboard";
import LearningPlanResources from "../pages/LearningPlanResources";

// Post-related Imports
import {
  GetAllPosts,
  Create as CreatePost,
  CreateWithMultipleImages,
  Update as UpdatePost,
  Delete as DeletePost,
  VideoUploadForm,
  GetAllPostsForUsers,
  VideoList,
  VideoListForUsers,
  GetPostById,
  Home as PostHome,
} from "../pages/PostPages";


// Route Configurations
const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/learningplans/public",
    element: (
      <MainLayout>
        <PublicLearningPlans />
      </MainLayout>
    ),
  },
  {
    path: "/learningplans/public/:planId",
    element: (
      <MainLayout>
        <PublicLearningPlanResources />
      </MainLayout>
    ),
  },
];

const protectedRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/profile/:id", element: <Profile /> },
  { path: "/followers", element: <Followers /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/delete-account", element: <DeleteAccount /> },
  { path: "/explore", element: <UserList /> },
  { path: "/learning-plans", element: <LearningPlansDashboard /> },
  { path: "/learning-plans/:planId/resources", element: <LearningPlanResources /> },
];

// Post-related Routes
const postRoutes = [
  { path: "/post/posts", element: <GetAllPosts /> },
  { path: "/post/createpostselect", element: <PostHome /> },
  { path: "/post/create", element: <CreatePost /> },
  { path: "/post/CreateWithMultipleImages", element: <CreateWithMultipleImages /> },
  { path: "/post/update/:id", element: <UpdatePost /> },
  { path: "/post/delete/:id", element: <DeletePost /> },
  { path: "/post/createvid", element: <VideoUploadForm /> },
  { path: "/post/feed", element: <GetAllPostsForUsers /> },
  { path: "/post/videos", element: <VideoList /> },
  { path: "/post/feedvideo", element: <VideoListForUsers /> },
  { path: "/post/:id", element: <GetPostById /> },
];

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <MainLayout>{element}</MainLayout>
            </PrivateRoute>
          }
        />
      ))}


      {/* Post Routes */}
      {postRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <MainLayout>{element}</MainLayout>
            </PrivateRoute>
          }
        />
      ))}

    </Routes>
  );
}; 