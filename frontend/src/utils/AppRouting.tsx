import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage.tsx";
import { ProfilePage } from "@/pages/Profile.tsx";
import DashboardPage from "@/pages/dashboard/DashboardPage.tsx";

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
      <Route path={"/profile"} element={<ProfilePage />} />
      <Route path={"/dashboard"} element={<DashboardPage />} />
    </Routes>
  );
};
