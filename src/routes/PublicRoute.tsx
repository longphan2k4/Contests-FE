import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/authContext";
import CircularProgress from "@mui/material/CircularProgress";

interface PublicRouteProps {
  children?: React.ReactNode;
  restricted?: boolean; // Nếu true, route này không cho phép người đã login vào (vd: login, register)
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  restricted = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Hiển thị spinner loading của MUI
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  const isAuthenticated = !!user && !!user.role;
  if (isAuthenticated && restricted) {
    // Người đã đăng nhập mà truy cập trang restricted (login, register) thì redirect
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
