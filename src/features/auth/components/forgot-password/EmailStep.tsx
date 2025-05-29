import { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  InputAdornment,
  Alert
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { CAO_THANG_COLORS } from '../../../../common/theme';

interface EmailStepProps {
  onSubmit: (email: string) => void;
}

const EmailStep = ({ onSubmit }: EmailStepProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    
    if (!isValid) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ');
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Giả lập gọi API gửi OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Chuyển sang bước tiếp theo
      onSubmit(email);
    } catch {
      setError('Không thể gửi mã xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          mb: 2
        }}
      >
        QUÊN MẬT KHẨU
      </Typography>

      <Typography 
        variant="body1" 
        align="center"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        Vui lòng nhập địa chỉ email đã đăng ký để nhận mã xác thực
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'error.light',
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Địa chỉ email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: CAO_THANG_COLORS.secondary }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 1,
            mb: 2,
            py: 1.5,
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {loading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
        </Button>
      </form>
    </>
  );
};

export default EmailStep; 