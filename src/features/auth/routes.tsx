import { Route } from "react-router-dom";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgot-password";
import PublicRoute from "../../routes/PublicRoute";

// Tạo placeholder component cho các trang xác thực
const RegisterPage = () => <div>Trang Đăng ký</div>;
const ResetPasswordPage = () => <div>Trang Đặt lại mật khẩu</div>;

const AuthRoutes = () => {
  return (
    <Route path="/" element={<PublicRoute restricted={true} />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Route>
  );
};

export default AuthRoutes;
