import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { getAboutInfo } from '../../features/admin/about/services/aboutService';
import type { About } from '../../features/admin/about/types/about';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';

const AdminFooter: React.FC = () => {
  const [aboutInfo, setAboutInfo] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  // Mô phỏng việc lấy thông tin từ API
  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const data = await getAboutInfo();
        setAboutInfo(data);
      } catch (error) {
        console.error('Error fetching about info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutInfo();
  }, []);

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <Box component="footer" sx={{ py: 2, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">Đang tải thông tin...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!aboutInfo) return null;

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
            {aboutInfo.data.schoolName}
          </Typography>
          {aboutInfo.data.departmentName && (
            <Typography variant="body2" color="text.secondary">
              {aboutInfo.data.departmentName}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mb: 1,
          flexWrap: 'wrap'
        }}>
          {aboutInfo.data.website && (
            <Link href={aboutInfo.data.website} target="_blank" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} /> Website
            </Link>
          )}
          {aboutInfo.data.email && (
            <Link href={`mailto:${aboutInfo.data.email}`} underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 0.5 }} /> Email
            </Link>
          )}
          {aboutInfo.data.fanpage && (
            <Link href={aboutInfo.data.fanpage} target="_blank" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
              <FacebookIcon fontSize="small" sx={{ mr: 0.5 }} /> Fanpage
            </Link>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} Hệ thống quản lý cuộc thi. Bảo lưu mọi quyền.
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminFooter; 