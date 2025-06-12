import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Alert,
  FormHelperText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Person, Email } from "@mui/icons-material";
import { CAO_THANG_COLORS } from "../../../common/theme";
import type { ChangeAccountInfoData, ChangeAccountInfoFormProps } from "../types/ChangeAccountInfoForm.types";

const ChangeAccountInfoForm: React.FC<ChangeAccountInfoFormProps> = ({
  onSubmit,
  error,
  changeAccountInfoStatus,
  initialData,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ChangeAccountInfoData>(initialData);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Reset form khi initialData thay đổi
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleClickOpen = () => {
    setOpen(true);
    setUsernameError("");
    setEmailError("");
    setFormData(initialData);
  };

  const handleClose = () => {
    setOpen(false);
    setUsernameError("");
    setEmailError("");
    setFormData(initialData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "username") {
      setUsernameError("");
    } else if (name === "email") {
      setEmailError("");
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    if (!formData.username.trim()) {
      setUsernameError("Tên người dùng không được để trống");
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Email không hợp lệ");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (changeAccountInfoStatus !== "pending") {
        handleClose();
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Person />}
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
        Đổi thông tin
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 2 },
        }}
      >
       <DialogTitle sx={{ pb: 2 }}>
  <Typography
    variant="h6"
    component="span" // Hoặc component="div"
    sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
  >
    <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
    Đổi thông tin tài khoản
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

          <form onSubmit={handleSubmit} id="change-account-info-form">
            <Box sx={{ my: 2 }}>
              <TextField
                required
                fullWidth
                name="username"
                label="Tên người dùng"
                value={formData.username}
                onChange={handleChange}
                error={!!usernameError}
                sx={{ mb: usernameError ? 0 : 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: CAO_THANG_COLORS.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              {usernameError && (
                <FormHelperText error sx={{ mb: 2, ml: 2 }}>
                  {usernameError}
                </FormHelperText>
              )}

              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={!!emailError}
                sx={{ mb: emailError ? 0 : 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: CAO_THANG_COLORS.secondary }} />
                    </InputAdornment>
                  ),
                }}
              />
              {emailError && (
                <FormHelperText error sx={{ mb: 2, ml: 2 }}>
                  {emailError}
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
            form="change-account-info-form"
            variant="contained"
            disabled={changeAccountInfoStatus === "pending"}
            sx={{
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
              minWidth: "140px",
            }}
          >
            {changeAccountInfoStatus === "pending" ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeAccountInfoForm;