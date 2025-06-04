import { Box, Typography, Paper, Card, CircularProgress, Alert, Snackbar, AlertTitle } from '@mui/material';
import AboutForm from '../components/AboutForm';
import { useAbout } from '../hooks/useAbout';
import { useState } from 'react';
import type { AboutData } from '../types/about';

/**
 * Trang quản lý thông tin giới thiệu trong admin
 */
const AboutAdminPage = () => {
  const { about, loading, error, updating, updateAboutInfo } = useAbout();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleUpdate = async (data: Partial<AboutData>): Promise<void> => {
    try {
      await updateAboutInfo(data);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Thông tin giới thiệu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Quản lý thông tin giới thiệu về đơn vị tổ chức hiển thị trên trang web
          </Typography>

          {about ? (
            <AboutForm 
              initialData={about} 
              onSubmit={handleUpdate}
              isSubmitting={updating}
            />
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Không tìm thấy dữ liệu</Typography>
            </Paper>
          )}
        </Box>
      </Card>


      {/* Success Alert */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success"
          variant="filled"
          elevation={6}
        >
          <AlertTitle>Thành công</AlertTitle>
          Cập nhật thông tin giới thiệu thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutAdminPage;