import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Thay thế bằng logic kiểm tra đăng nhập thực tế của bạn
  const isAuthenticated = sessionStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Chuyển hướng tới trang đăng nhập, lưu lại URL hiện tại để quay lại sau khi đăng nhập
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute; 