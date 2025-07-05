import React from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import type { School } from "../types/school";
import type { ValidationError } from "../types/validation";
import { useSchoolForm } from "../hooks/form/useSchoolForm";

interface SchoolFormProps {
  initialData?: Partial<School>;
  onSubmit: (data: Partial<School>) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  validationErrors?: ValidationError[];
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Lưu",
  validationErrors = [],
}) => {
  const { formData, errors, handleChange, handleSwitchChange, handleSubmit } =
    useSchoolForm(initialData, onSubmit, validationErrors);

  return (
    <>
      {/* Hiển thị tổng quan lỗi validation nếu có */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Vui lòng kiểm tra lại thông tin đã nhập
          {validationErrors.map(error => (
            <div key={error.field}>{error.message}</div>
          ))}
        </Alert>
      )}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label="Tên trường"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isSubmitting}
                    margin="normal"
                  />
                </Box>
              </Stack>
              <Box>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  disabled={isSubmitting}
                  margin="normal"
                />
              </Box>
            </Box>
          </Box>

          {/* Thông tin liên hệ */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                    margin="normal"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disabled={isSubmitting}
                    margin="normal"
                  />
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Thông tin khác */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin khác
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive || false}
                    onChange={handleSwitchChange}
                    name="isActive"
                    disabled={isSubmitting}
                  />
                }
                label="Trường đang hoạt động"
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {submitButtonText}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default SchoolForm;
