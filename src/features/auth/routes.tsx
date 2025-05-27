import { Route } from 'react-router-dom';
import PublicRoute from '../../routes/PublicRoute';

// Tạo placeholder component cho các trang xác thực
const LoginPage = () => <div>Trang Đăng nhập</div>;
const RegisterPage = () => <div>Trang Đăng ký</div>;
const ForgotPasswordPage = () => <div>Trang Quên mật khẩu</div>;
const ResetPasswordPage = () => <div>Trang Đặt lại mật khẩu</div>;

const AuthRoutes = () => {
  return (
    <Route path="/auth" element={<PublicRoute restricted />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Route>
  );
};

export default AuthRoutes; 