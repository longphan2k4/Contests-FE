// src/auth/pages/ProfilePage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  FormHelperText,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Person } from "@mui/icons-material";
import { CAO_THANG_COLORS } from "../../../../common/theme";
import { useAuth } from "../../../auth/hooks/authContext";
import { useProfile } from "../../../auth/hooks/useprofile";
import useChangePassword from "../../hooks/useChangePassword";
import { useNotification } from "../../../../contexts/NotificationContext";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isFetching } = useProfile();
  const { mutate: changePassword, status: changePasswordStatus } = useChangePassword();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "newPassword") {
      setPasswordError("");
    } else if (name === "confirmNewPassword") {
      setConfirmPasswordError("");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const validatePassword = (): boolean => {
    let isValid = true;
    if (formData.newPassword.length < 8) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự");
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.newPassword
      )
    ) {
      setPasswordError(
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      );
      isValid = false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setConfirmPasswordError("Xác nhận mật khẩu không khớp");
      isValid = false;
    }
    return isValid;
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    changePassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      },
      {
        onSuccess: () => {
          showSuccessNotification("Đổi mật khẩu thành công!");
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
          // Tùy chọn: Đăng xuất sau khi đổi mật khẩu
          document.cookie = "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        },
        onError: (error: any) => {
          const apiMessage = error.response?.data?.message;
          showErrorNotification(apiMessage || "Đổi mật khẩu thất bại!");
          setError(apiMessage || "Đổi mật khẩu thất bại!");
        },
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(135deg, ${CAO_THANG_COLORS.primary} 0%, ${CAO_THANG_COLORS.secondary} 100%)`,
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          top: "-250px",
          right: "-150px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          bottom: "-150px",
          left: "-100px",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            background: alpha("#fff", 0.9),
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              mb: 4,
            }}
          >
            HỒ SƠ TÀI KHOẢN
          </Typography>

          {authLoading || isFetching ? (
            <Typography align="center" color="text.secondary">
              Đang tải...
            </Typography>
          ) : user ? (
            <>
              {/* Phần thông tin tài khoản */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Thông tin tài khoản
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Tên người dùng"
                    value={user.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Email"
                    value={user.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Vai trò"
                    value={user.role}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Trạng thái"
                    value={user.isActive ? "Hoạt động" : "Không hoạt động"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Phần đổi mật khẩu */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Đổi mật khẩu
              </Typography>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "error.light",
                  }}
                >
                  {error}
                </Alert>
              )}
              <form onSubmit={handleChangePassword}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    required
                    fullWidth
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="newPassword"
                    label="Mật khẩu mới"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={!!passwordError}
                    sx={{ mb: passwordError ? 0 : 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {passwordError && (
                    <FormHelperText error sx={{ mb: 2, ml: 2 }}>
                      {passwordError}
                    </FormHelperText>
                  )}
                  <TextField
                    required
                    fullWidth
                    name="confirmNewPassword"
                    label="Xác nhận mật khẩu mới"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    error={!!confirmPasswordError}
                    sx={{ mb: confirmPasswordError ? 0 : 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: CAO_THANG_COLORS.secondary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {confirmPasswordError && (
                    <FormHelperText error sx={{ mb: 2, ml: 2 }}>
                      {confirmPasswordError}
                    </FormHelperText>
                  )}
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={changePasswordStatus === "pending"}
                  sx={{
                    py: 1.5,
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {changePasswordStatus === "pending" ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
              </form>
            </>
          ) : (
            <Typography align="center" color="error">
              Vui lòng đăng nhập để xem hồ sơ
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;