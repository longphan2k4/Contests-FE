import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
import AdminRoutes from "../features/admin/AdminRoutes";
import AuthRoutes from "../features/auth/routes";
import PublicRoutes from "./PublicRoutes";
// import MatchRoutes from '../features/match';
import MatchPage from "../features/match/pages/MatchPage";
import TechBanner from "../features/match/components/MediaPopup/BackGround";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes()}

      {/* Auth Routes - Đăng nhập, Đăng ký */}
      {AuthRoutes()}

      {/* Private Routes - Yêu cầu xác thực */}
      {/* <Route element={<PrivateRoute />}>
        {AdminRoutes()}
      </Route> */}
      <Route element={<PrivateRoute roles={["Admin", "Judge"]} />}>
      </Route>
      {AdminRoutes()}

      {/* Chuyển hướng từ / đến /auth/login nếu chưa đăng nhập hoặc /admin/dashboard nếu đã đăng nhập */}
      <Route
        path="/"
        element={
          sessionStorage.getItem("token") ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route path="/match" element={<MatchPage />} />
      <Route path="/banner" element={<TechBanner />} />
      {/* Các route khác */}
      {/* <Route path="/match/*" element={<MatchRoutes />} /> */}

      {/* Route mặc định */}
      {/* Xử lý route không tồn tại */}
      <Route path="*" element={<div>Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;
