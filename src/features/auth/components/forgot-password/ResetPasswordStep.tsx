import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { CAO_THANG_COLORS } from "../../../../common/theme";

interface ResetPasswordStepProps {
  onSubmit: (data: { newPassword: string; confirmNewPassword: string }) => void;
  onBack: () => void;
  loading?: boolean;
}

const ResetPasswordStep = ({
  onSubmit,
  onBack,
  loading,
}: ResetPasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (name === "newPassword") {
      setPasswordError("");
    } else if (name === "confirmNewPassword") {
      setConfirmPasswordError("");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(show => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(show => !show);
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
    setError("");
    try {
      await onSubmit({
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
    } catch {
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
          backgroundClip: "text",
          textFillColor: "transparent",
          mb: 2,
        }}
      >
        ĐẶT LẠI MẬT KHẨU
      </Typography>

      <Typography
        variant="body1"
        align="center"
        sx={{ mb: 4, color: "text.secondary" }}
      >
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn
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
            name="newPassword"
            label="Mật khẩu mới"
            type={showPassword ? "text" : "password"}
            id="newPassword"
            autoComplete="new-password"
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
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            required
            fullWidth
            name="confirmNewPassword"
            label="Xác nhận mật khẩu mới"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmNewPassword"
            autoComplete="new-password"
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

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onBack}
            sx={{
              py: 1.5,
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ResetPasswordStep;
