import React from "react";
import {
  TextField,
  Box,
  Link,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { CAO_THANG_COLORS } from "../../../common/theme";

interface LoginFormFieldsProps {
  loading: boolean;
  errors: any;
  formMethods: any;
  onSubmit: (data: { identifier: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormFieldsProps> = ({
  loading,
  errors,
  formMethods,
  onSubmit,
}) => {
  const { register, handleSubmit } = formMethods;
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="identifier"
        label="Tên đăng nhập"
        autoComplete="email"
        autoFocus
        {...register("identifier")}
        error={!!errors.identifier}
        helperText={errors.identifier?.message}
        placeholder="Nhập email hoặc tên đăng nhập"
        variant="outlined"
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            transition: "0.3s",
            "&:hover fieldset": {
              borderColor: CAO_THANG_COLORS.accent,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: CAO_THANG_COLORS.secondary,
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: CAO_THANG_COLORS.secondary,
            },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: CAO_THANG_COLORS.secondary }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        variant="outlined"
        placeholder="Nhập mật khẩu"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            transition: "0.3s",
            "&:hover fieldset": {
              borderColor: CAO_THANG_COLORS.accent,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: CAO_THANG_COLORS.secondary,
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: CAO_THANG_COLORS.secondary,
            },
        }}
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
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{
            color: CAO_THANG_COLORS.secondary,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Quên mật khẩu?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          mt: 1,
          mb: 3,
          py: 1.5,
          borderRadius: "10px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.accent})`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            transform: "translateY(-2px)",
            background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
          },
        }}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;
