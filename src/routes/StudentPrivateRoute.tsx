import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { StudentApiService } from "../features/student/services/api";

interface StudentPrivateRouteProps {
  children?: React.ReactNode;
}

const StudentPrivateRoute: React.FC<StudentPrivateRouteProps> = ({
  children,
}) => {
  const location = useLocation();

  const feAccessToken = localStorage.getItem("feAccessToken");
  if (feAccessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  // Kiểm tra authentication cho student
  const isAuthenticated = StudentApiService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default StudentPrivateRoute;
