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

export function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public landing/login */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* everything inside here requires auth */}
        <Route element={<PrivateRoute />}>
          {/* DashboardLayout wraps all the “/home”, “/profile”, etc */}
          <Route path="/" element={<DashboardPage />}>
            {/* redirect “/” → “/home” */}
            <Route index element={<Navigate to="home" replace />} />

            {/* your nested pages */}
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="explore" element={<UserList />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="followers" element={<Followers />} />
            <Route path="delete-account" element={<DeleteAccount />} />

            {/* catch-all for “/anything-else” inside dashboard */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
