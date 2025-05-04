import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppRouting } from "@/utils/AppRouting.tsx";
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Followers from './pages/Followers';
import EditProfile from './pages/EditProfile';
import DeleteAccount from './pages/DeleteAccount';
import LandingPage from './pages/LandingPage';
import UserList from './pages/UserList';
import PublicLearningPlans from './pages/PublicLearningPlans';
import LearningPlansDashboard from './pages/LearningPlansDashboard';

const App = () => {
  return (
    <AuthProvider>
      <AppRouting />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learningplans/public" element={<PublicLearningPlans />} />

          {/* Protected Routes */}
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
          <Route
            path="/learning-plans"
            element={
              <PrivateRoute>
                <MainLayout>
                  <LearningPlansDashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </AuthProvider>
  );
};

export default App;
