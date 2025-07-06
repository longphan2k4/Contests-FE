import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../features/auth/hooks/authContext";

interface PrivateRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) {
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

  if (!user || !user.role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
