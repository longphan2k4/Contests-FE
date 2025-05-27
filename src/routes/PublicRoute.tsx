import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  children?: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  
  // Thay thế bằng logic kiểm tra đăng nhập thực tế của bạn
  const isAuthenticated = sessionStorage.getItem('token') !== null;
  
  // Nếu đã đăng nhập và route bị hạn chế (như trang đăng nhập),
  // chuyển hướng đến trang mặc định (dashboard)
  if (isAuthenticated && restricted) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute; 