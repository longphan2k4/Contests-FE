import React from "react";
import { Routes, Route } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import AdminRoutes from "../features/admin/AdminRoutes";
<<<<<<< HEAD
import ContestRoutes from "../features/Contest/ContestRouter";

=======
import ContestRoutes from "../features/contest/ContestRouter";
>>>>>>> 2d2828ae5735ea44db6fdff1fa58ea04fa37971e
import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";
// import MatchRoutes from '../features/match';
import MatchPage from "../features/match/pages/MatchPage";
import ControlsPage from "../features/admin/controls/pages/ControlsPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";
import Forbidden403 from "../components/403";
import ProfilePage from "../features/account/pages/ProfilePage";
import JudgeHomePage from "../features/judge/pages/JudgeHomePage";
import MatchSelectionPage from "../features/judge/pages/MatchSelectionPage";
import EliminatePage from "../features/match/pages/EliminatePage";
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
        {AdminRoutes()}
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>
      {/* Public Routes */}
      <Route path="/judge/home" element={<JudgeHomePage />} />
      <Route path="/judge/selected-match" element={<MatchSelectionPage />} />
      <Route path="/match" element={<MatchPage />} />
<<<<<<< HEAD
      <Route path="/match/controls" element={<ControlsPage />} />
=======
      <Route path="/match/eliminate" element={<EliminatePage />} />
>>>>>>> 2d2828ae5735ea44db6fdff1fa58ea04fa37971e
      <Route path="/banner" element={<TechBanner />} />
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;
