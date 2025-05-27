import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const AdminFooter: React.FC = () => {
  const [aboutInfo] = useState({
    schoolName: 'Trường Cao Đẳng Kỹ Thuật Cao Thắng',
    website: 'https://www.caothang.edu.vn/',
    email: 'ktcaothang@caothang.edu.vn',
    fanpage: 'https://www.facebook.com/caothang.edu.vn'
  });

  // Mô phỏng việc lấy thông tin từ API
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy thông tin từ bảng About
    // const fetchAboutInfo = async () => {
    //   const response = await fetch('/api/about');
    //   const data = await response.json();
    //   setAboutInfo({
    //     schoolName: data.school_name,
    //     website: data.website,
    //     email: data.email,
    //     fanpage: data.fanpage
    //   });
    // };
    // fetchAboutInfo();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {aboutInfo.schoolName}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mb: 1,
          flexWrap: 'wrap'
        }}>
          <Link href={aboutInfo.website} target="_blank" underline="hover">
            Website
          </Link>
          <Link href={`mailto:${aboutInfo.email}`} underline="hover">
            Email
          </Link>
          <Link href={aboutInfo.fanpage} target="_blank" underline="hover">
            Fanpage
          </Link>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} Hệ thống quản lý cuộc thi. Bảo lưu mọi quyền.
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminFooter; 