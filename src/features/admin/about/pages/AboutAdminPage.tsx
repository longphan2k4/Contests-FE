import { Box, Typography, Paper } from '@mui/material';
import { AboutForm, MapDisplay, LoadingState, ErrorState } from '../components';
import useAboutInfo from '../hooks/useAboutInfo';

/**
 * Trang quản lý thông tin giới thiệu trong admin
 */
const AboutAdminPage = () => {
  // Sử dụng custom hook để quản lý logic
  const { aboutInfo, 
    loading, 
    error, 
    handleSubmit, 
    handleResetToDefault 
  } = useAboutInfo();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Quản lý thông tin website
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <AboutForm 
          aboutInfo={aboutInfo} 
          onSubmit={handleSubmit} 
          onReset={handleResetToDefault} 
        />
      </Paper>

      {/* Xem trước bản đồ */}
      {aboutInfo.mapEmbedCode && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" mb={2}>
            Xem trước bản đồ
          </Typography>
          <MapDisplay mapEmbedCode={aboutInfo.mapEmbedCode} />
        </Paper>
      )}
    </Box>
  );
};

export default AboutAdminPage; 