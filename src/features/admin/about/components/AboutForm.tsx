import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';
import type { About } from '../types/about';

interface AboutFormProps {
  aboutInfo: About;
  onSubmit: (data: About) => Promise<void>;
  onReset: () => void;
}

/**
 * Component form chỉnh sửa thông tin giới thiệu
 */
const AboutForm: React.FC<AboutFormProps> = ({ aboutInfo, onSubmit, onReset }) => {
  const [formData, setFormData] = useState<About>(aboutInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onSubmit(formData);
      setSuccess('Cập nhật thông tin thành công');
    } catch (err) {
      setError('Không thể cập nhật thông tin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý reset form
  const handleReset = () => {
    onReset();
    setFormData(aboutInfo);
    setSuccess('Đã khôi phục dữ liệu mặc định');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {/* Thông tin cơ bản */}
        <TextField
          required
          fullWidth
          label="Tên trường"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
        />
        
        {/* Thông tin website và khoa */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Tên khoa"
            name="departmentName"
            value={formData.departmentName || ''}
            onChange={handleChange}
          />
        </Stack>
        
        {/* Thông tin liên hệ */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Fanpage"
            name="fanpage"
            value={formData.fanpage || ''}
            onChange={handleChange}
          />
        </Stack>
        
        {/* Mã nhúng bản đồ */}
        <TextField
          fullWidth
          label="Mã nhúng bản đồ (Google Maps Embed)"
          name="mapEmbedCode"
          multiline
          rows={4}
          value={formData.mapEmbedCode || ''}
          onChange={handleChange}
          helperText="Dán mã nhúng iframe từ Google Maps"
        />
        
        {/* Thông báo lỗi và thành công */}
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        
        {success && (
          <Typography color="primary">{success}</Typography>
        )}
        
        {/* Các nút hành động */}
        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật thông tin'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
          >
            Khôi phục mặc định
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AboutForm; 