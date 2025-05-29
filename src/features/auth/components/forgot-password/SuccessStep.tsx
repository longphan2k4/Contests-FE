import { 
  Box, 
  Typography, 
  Button,
  Avatar
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { CAO_THANG_COLORS } from '../../../../common/theme';
import { Link as RouterLink } from 'react-router-dom';

const SuccessStep = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Avatar
        sx={{
          bgcolor: CAO_THANG_COLORS.success,
          width: 80,
          height: 80,
          margin: '0 auto 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <CheckCircle fontSize="large" />
      </Avatar>

      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          mb: 2
        }}
      >
        Thành công!
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.
      </Typography>

      <Button
        component={RouterLink}
        to="/auth/login"
        variant="contained"
        size="large"
        sx={{
          py: 1.5,
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 600,
          minWidth: 200,
        }}
      >
        Đăng nhập
      </Button>
    </Box>
  );
};

export default SuccessStep; 