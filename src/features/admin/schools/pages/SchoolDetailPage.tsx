import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Card,
  CardContent,
  Breadcrumbs,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { School } from '../types/school';
// Mock data (sẽ được thay thế bằng dữ liệu từ API sau này)
const mockSchool = {
  id: 1, 
  name: 'Trường Đại học Bách Khoa Hà Nội', 
  code: 'HUST',
  address: '1 Đại Cồ Việt, Hai Bà Trưng',
  city: 'Hà Nội', 
  district: 'Hai Bà Trưng',
  email: 'dhbk@hust.edu.vn', 
  phone: '024 3623 1732',
  website: 'https://hust.edu.vn',
  logo: 'https://upload.wikimedia.org/wikipedia/vi/c/cd/Logo_Dai_hoc_Bach_Khoa_Hanoi.svg',
  description: 'Trường Đại học Bách khoa Hà Nội là trường đại học đa ngành về kỹ thuật được thành lập ở Hà Nội ngày 15 tháng 10 năm 1956. Trường trở thành thành viên của Đại học Quốc gia Hà Nội từ tháng 12 năm 1956 đến tháng 7 năm 2010, khi VNU tái cấu trúc trường thành trường đại học quốc gia trực thuộc chính phủ Việt Nam.',
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-06-15T08:30:00Z',
};

const SchoolDetailPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const schoolId = parseInt(id || '0');
  
  const [school, setSchool] = useState<School>(mockSchool);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    // Mô phỏng gọi API
    const fetchSchoolDetail = async () => {
      setLoading(true);
      
      try {
        // Đây là nơi bạn sẽ gọi API thực tế
        // Giả lập độ trễ API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (schoolId === 0) {
          throw new Error('ID trường học không hợp lệ');
        }
        
        // Sử dụng mock data cho demo
        setSchool(mockSchool);
        setError('');
      } catch (error) {
        setError(error as string || 'Không thể tải thông tin trường học');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolDetail();
  }, [schoolId]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/admin/schools"
          startIcon={<ArrowBackIcon />}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/admin/schools" style={{ textDecoration: 'none', color: 'inherit' }}>
          Trường học
        </Link>
        <Typography color="text.primary">Chi tiết</Typography>
      </Breadcrumbs>

      {/* Header với nút chức năng */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Chi tiết trường học</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/admin/schools"
          >
            Quay lại danh sách
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            component={Link}
            to={`/admin/schools/edit/${school.id}`}
          >
            Chỉnh sửa
          </Button>
        </Stack>
      </Box>
      
      {/* Thông tin chi tiết */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Thông tin cơ bản */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={school.logo}
              alt={school.name}
              variant="rounded"
              sx={{ width: 80, height: 80, mr: 2 }}
            >
              {school.code.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">{school.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  Mã: <strong>{school.code}</strong>
                </Typography>
                <Chip
                  label={school.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  color={school.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Thông tin chi tiết */}
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Thông tin liên hệ
          </Typography>
          
          <Table size="small" sx={{ mb: 3 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '30%', borderBottom: 'none', pl: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Địa chỉ</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  {school.address}, {school.district}, {school.city}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%', borderBottom: 'none', pl: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Email</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{school.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: '30%', borderBottom: 'none', pl: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Điện thoại</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{school.phone}</TableCell>
              </TableRow>
              {school.website && (
                <TableRow>
                  <TableCell sx={{ width: '30%', borderBottom: 'none', pl: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">Website</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <a href={school.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      {school.website}
                    </a>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {school.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Mô tả
              </Typography>
              <Typography variant="body2" paragraph>
                {school.description}
              </Typography>
            </>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Thông tin hệ thống */}
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Thông tin hệ thống
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Ngày tạo: {formatDate(school.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật lần cuối: {formatDate(school.updatedAt)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SchoolDetailPage; 