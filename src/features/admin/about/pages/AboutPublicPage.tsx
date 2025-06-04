import { Box, Typography, Stack, Container } from '@mui/material';
import { 
  ContactInfoCard, 
  MapCard, 
  LoadingState, 
  ErrorState 
} from '../components';
import { useAboutPublicInfo } from '../hooks';

/**
 * Trang giới thiệu dành cho người dùng
 */
const AboutPublicPage = () => {
  const { aboutInfo, 
    loading, 
    error 
  } = useAboutPublicInfo();

  if (loading) {
    return <LoadingState fullPage />;
  }

  if (error || !aboutInfo) {
    return <ErrorState message={error || 'Không có thông tin giới thiệu'} fullPage />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Giới thiệu
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mt: 2 }}>
          {/* Thông tin liên hệ */}
          <Box sx={{ flex: 1 }}>
            <ContactInfoCard aboutInfo={aboutInfo} />
          </Box>

          {/* Bản đồ */}
          <Box sx={{ flex: 1 }}>
            <MapCard mapEmbedCode={aboutInfo.data.mapEmbedCode} />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AboutPublicPage; 