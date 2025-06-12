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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, VpnKey } from "@mui/icons-material";
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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
    // Reset form khi mở popup
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form khi đóng popup
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError("");
    setConfirmPasswordError("");
  };

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

  // Validate newPassword
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

  // Validate confirmNewPassword
  if (formData.confirmNewPassword.length < 8) {
    setConfirmPasswordError("Xác nhận mật khẩu phải có ít nhất 8 ký tự");
    isValid = false;
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
      formData.confirmNewPassword
    )
  ) {
    setConfirmPasswordError(
      "Xác nhận mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    );
    isValid = false;
  }

  // Check if passwords match
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
      // Đóng popup sau khi submit thành công
      if (changePasswordStatus !== "pending") {
        handleClose();
      }
    }
  };

  return (
    <>
      {/* Nút đổi mật khẩu */}
      <Button
        variant="outlined"
        startIcon={<VpnKey />}
        onClick={handleClickOpen}
        sx={{
          borderRadius: "10px",
          px: 3,
          py: 1.5,
          fontWeight: 600,
          borderColor: CAO_THANG_COLORS.secondary,
          color: CAO_THANG_COLORS.secondary,
          "&:hover": {
            borderColor: CAO_THANG_COLORS.primary,
            backgroundColor: `${CAO_THANG_COLORS.primary}10`,
          },
        }}
      >
        Đổi mật khẩu
      </Button>

      {/* Dialog/Popup chứa form đổi mật khẩu */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
            <VpnKey sx={{ color: CAO_THANG_COLORS.secondary }} />
            Đổi mật khẩu
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
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

          <form onSubmit={handleSubmit} id="change-password-form">
            <Box sx={{ mb: 2 }}>
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
                sx={{ mb: confirmPasswordError ? 0 : 2 }}
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
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            variant="contained"
            disabled={changePasswordStatus === "pending"}
            sx={{
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
              minWidth: "140px",
            }}
          >
            {changePasswordStatus === "pending" ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangePasswordForm;