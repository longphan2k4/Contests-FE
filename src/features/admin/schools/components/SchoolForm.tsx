import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Button,
  Stack,
  Typography,
  Paper
} from '@mui/material';
import type { School } from '../types/school';

// Danh sách thành phố
const CITIES = [
  'Hà Nội', 
  'TP. Hồ Chí Minh', 
  'Đà Nẵng', 
  'Hải Phòng', 
  'Cần Thơ',
  'Huế',
  'Nha Trang',
  'Vũng Tàu'
];

interface SchoolFormProps {
  initialData?: Partial<School>;
  onSubmit: (data: Partial<School>) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Lưu'
}) => {
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    code: '',
    address: '',
    city: '',
    district: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    isActive: true,
    ...initialData
  });

  // Cập nhật form khi initialData thay đổi
  useEffect(() => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      district: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      isActive: true,
      ...initialData
    });
  }, [initialData]);

  // Thay đổi kiểu dữ liệu cho phép undefined
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra tên trường
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên trường không được để trống';
    }

    // Kiểm tra mã trường
    if (!formData.code?.trim()) {
      newErrors.code = 'Mã trường không được để trống';
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
    return Object.keys(newErrors).length === 0;
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
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  required
                  label="Mã trường"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  error={!!errors.code}
                  helperText={errors.code || 'Mã viết tắt của trường, ví dụ: HUST'}
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  fullWidth
                  label="Thành phố"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  margin="normal"
                >
                  {CITIES.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Quận/Huyện"
                  name="district"
                  value={formData.district || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  margin="normal"
                />
              </Box>
            </Stack>
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
            <Box>
              <TextField
                fullWidth
                type="url"
                label="Website"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                disabled={isSubmitting}
                margin="normal"
              />
            </Box>
          </Box>
        </Box>

        {/* Thông tin khác */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thông tin khác
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              margin="normal"
            />
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {submitButtonText}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SchoolForm; 