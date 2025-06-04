import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Stack,
  Breadcrumbs
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

// Danh sách thành phố mẫu
const mockCities = [
  'Hà Nội', 
  'TP. Hồ Chí Minh', 
  'Đà Nẵng', 
  'Hải Phòng', 
  'Cần Thơ'
];

const SchoolCreatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    district: '',
    email: '',
    phone: '',
    website: '',
    logo: '',
    description: '',
    isActive: true
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name as string]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Tên trường học không được để trống');
      return;
    }
    
    if (!formData.code.trim()) {
      setError('Mã trường không được để trống');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email không được để trống');
      return;
    }

    if (!formData.city) {
      setError('Vui lòng chọn thành phố');
      return;
    }

    setLoading(true);
    setError('');

    // Mô phỏng gọi API
    setTimeout(() => {
      console.log('Form submitted with data:', formData);
      setSuccess(true);
      setLoading(false);
      
      // Reset form sau khi submit thành công
      setFormData({
        name: '',
        code: '',
        address: '',
        city: '',
        district: '',
        email: '',
        phone: '',
        website: '',
        logo: '',
        description: '',
        isActive: true
      });
      
      // Ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/admin/schools" style={{ textDecoration: 'none', color: 'inherit' }}>
          Trường học
        </Link>
        <Typography color="text.primary">Thêm mới</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Thêm mới trường học</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/admin/schools"
        >
          Quay lại
        </Button>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Thêm trường học thành công!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin cơ bản
            </Typography>
          </Box>

          {/* Tên và Mã */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {/* Tên trường */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                label="Tên trường"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>

            {/* Mã trường */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                label="Mã trường"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={loading}
                helperText="Mã viết tắt của trường, ví dụ: HUST"
              />
            </Box>
          </Stack>

          {/* Thành phố và Quận/Huyện */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {/* Thành phố */}
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Thành phố</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  label="Thành phố"
                  onChange={handleSelectChange}
                  disabled={loading}
                >
                  {mockCities.map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Quận/Huyện */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>
          </Stack>

          {/* Địa chỉ */}
          <Box>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </Box>

          {/* Thông tin liên hệ */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin liên hệ
            </Typography>
          </Box>

          {/* Email và Số điện thoại */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {/* Email */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>

            {/* Số điện thoại */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>
          </Stack>

          {/* Website và Logo URL */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {/* Website */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.edu.vn"
              />
            </Box>

            {/* Logo URL */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="URL Logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.edu.vn/logo.png"
                helperText="Link đến hình ảnh logo của trường"
              />
            </Box>
          </Stack>

          {/* Mô tả */}
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </Box>

          {/* Trạng thái */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  name="isActive"
                  disabled={loading}
                  color="primary"
                />
              }
              label="Đang hoạt động"
            />
          </Box>

          {/* Nút submit */}
          <Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button 
                variant="outlined"
                component={Link}
                to="/admin/schools"
                disabled={loading}
              >
                Hủy
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SchoolCreatePage; 