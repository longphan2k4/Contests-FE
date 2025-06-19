import React from "react";
import { Routes, Route } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import AdminRoutes from "../features/admin/AdminRoutes";
import ContestRoutes from "../features/Contest/ContestRouter";

import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";

import MatchPage from "../features/match/pages/MatchPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";
import Forbidden403 from "../components/403";
import ProfilePage from "../features/account/pages/ProfilePage";
import JudgeHomePage from "../features/judge/pages/JudgeHomePage";
import MatchSelectionPage from "../features/judge/pages/MatchSelectionPage";
import EliminatePage from "../features/match/pages/EliminatePage";
import { SocketProvider } from "../contexts/SocketContext";
import ControlsPage from "../features/admin/controls/pages/ControlsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      {/* Auth Routes - Đăng nhập, Đăng ký */}
      {AuthRoutes()}

      <Route element={<PrivateRoute roles={["Admin"]} />}>
        {ContestRoutes()}
      </Route>

      <Route element={<PrivateRoute roles={["Admin"]} />}>
        <Route
          path="/admin/cuoc-thi/:slug/dieu-kien-tran-dau/:match"
          element={
            <SocketProvider>
              <ControlsPage />
            </SocketProvider>
          }
        />
      </Route>

      {AdminRoutes()}

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>
      {/* Public Routes */}
      <Route path="/judge/home" element={<JudgeHomePage />} />
      <Route path="/judge/selected-match" element={<MatchSelectionPage />} />

      <Route
        path="/match/:slug"
        element={
          <SocketProvider>
            <MatchPage />
          </SocketProvider>
        }
      />

      <Route path="/match/eliminate" element={<EliminatePage />} />
      <Route path="/banner" element={<TechBanner />} />
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;
