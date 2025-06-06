import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Typography,
  Paper
} from '@mui/material';
import type { School } from '../types/school';
import { useNotification } from '../../../../hooks';
import  NotificationSnackbar  from '../../components/NotificationSnackbar';

interface SchoolFormProps {
  initialData?: Partial<School>;
  onSubmit: (data: Partial<School>) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

const DEFAULT_FORM_DATA: Partial<School> = {
  name: '',
  address: '',
  email: '',
  phone: '',
  isActive: true
};

const SchoolForm: React.FC<SchoolFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Lưu'
}) => {
  const [formData, setFormData] = useState<Partial<School>>({
    ...DEFAULT_FORM_DATA,
    ...initialData
  });

  // Thông báo
  const {
    notificationState,
    showErrorNotification,
    hideNotification
  } = useNotification();

  useEffect(() => {
    // Chỉ chạy khi initialData có ít nhất một key (tức là parent truyền dữ liệu “edit”),
    // và nội dung khác với formData hiện tại
    if (
      initialData &&
      Object.keys(initialData).length > 0 
      // Nếu bạn muốn chắc chắn field nào đó thay đổi, có thể so sánh riêng từng key, ví dụ initialData.id
    ) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        ...initialData
      });
    }
  // Để dependency array chỉ contain initialData (object literal mới mỗi lần vẫn gây loop),
  // bạn có thể bóc riêng primitive field mà parent thay đổi, ví dụ initialData.id:
  }, [initialData?.id]); 

  // Thay đổi kiểu dữ liệu cho phép undefined
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra tên trường
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên trường không được để trống';
    }

    // Kiểm tra email
    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Kiểm tra số điện thoại
    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);

    // Nếu có lỗi, hiển thị thông báo lỗi đầu tiên
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showErrorNotification(firstError, 'Lỗi dữ liệu');
      return false;
    }
    
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng sửa trường đó
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label="Tên trường"
                    name="name"
                    value={formData.name || ''}
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
                  value={formData.address || ''}
                  onChange={handleChange}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email || ''}
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
                    value={formData.phone || ''}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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

      <NotificationSnackbar
        open={notificationState.open}
        onClose={hideNotification}
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
      />
    </>
  );
};

export default SchoolForm;