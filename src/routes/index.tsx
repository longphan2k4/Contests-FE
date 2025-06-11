import React from "react";
import { Routes, Route} from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import AdminRoutes from "../features/admin/AdminRoutes";
import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";
// import MatchRoutes from '../features/match';
import MatchPage from "../features/match/pages/MatchPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";
import Forbidden403 from "../components/403";
import ProfilePage from "../features/account/components/profile/ProfilePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      {/* Auth Routes - Đăng nhập, Đăng ký */}
      {AuthRoutes()}

      <Route element={<PrivateRoute roles={["Admin"]} />}>
        {AdminRoutes()}
      </Route>
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/account/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/match" element={<MatchPage />} />
      <Route path="/banner" element={<TechBanner />} />
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;
