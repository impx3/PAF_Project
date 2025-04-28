import React from "react";

import { ToastContainer } from "react-toastify";
import { AppRouting } from "@/utils/AppRouting.tsx";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouting />
      <ToastContainer />
      {/* <BrowserRouter>
        <Routes>
           Public Routes
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

           Protected Routes
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Followers />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EditProfile />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/delete-account"
            element={
              <PrivateRoute>
                <MainLayout>
                  <DeleteAccount />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <MainLayout>
                  <UserList />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>*/}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
    </AuthProvider>
  );
};
