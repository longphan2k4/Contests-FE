import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { CAO_THANG_COLORS } from "../../../common/theme";
import type { ChangePasswordData } from "../types/ChangePasswordForm.types";

interface ChangePasswordFormProps {
  onSubmit: (formData: ChangePasswordData) => void;
  error: string;
  changePasswordStatus: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  error,
  changePasswordStatus,
}) => {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (validatePassword()) {
      onSubmit(formData);
    }
  };

  return (
    <>
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
      <form onSubmit={handleSubmit}>
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
  );
};

export default ChangePasswordForm;