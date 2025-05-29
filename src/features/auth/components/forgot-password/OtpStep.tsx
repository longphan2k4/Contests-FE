import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Alert,
  TextField,
  Link
} from '@mui/material';
import { CAO_THANG_COLORS } from '../../../../common/theme';

interface OtpStepProps {
  email: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
  onResend: () => Promise<void>;
}

const OTP_LENGTH = 6;

const OtpStep = ({ email, onSubmit, onBack, onResend }: OtpStepProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    // Focus vào ô input đầu tiên khi component được mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Đếm ngược thời gian gửi lại OTP
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resending]);

  const handleChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    // Cập nhật giá trị OTP
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Chỉ lấy ký tự đầu tiên
    setOtp(newOtp);

    // Nếu đã nhập và không phải ô cuối cùng, focus vào ô tiếp theo
    if (value && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Nếu nhấn Backspace và ô hiện tại trống, focus vào ô trước đó
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Kiểm tra xem dữ liệu dán có phải là số không
    if (!/^\d*$/.test(pastedData)) return;
    
    // Lấy tối đa OTP_LENGTH ký tự
    const digits = pastedData.slice(0, OTP_LENGTH).split('');
    
    // Cập nhật các ô OTP
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < OTP_LENGTH) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus vào ô cuối cùng được điền
    const lastFilledIndex = Math.min(digits.length - 1, OTP_LENGTH - 1);
    if (lastFilledIndex >= 0 && inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Kiểm tra xem OTP đã nhập đủ chưa
    const otpValue = otp.join('');
    if (otpValue.length !== OTP_LENGTH) {
      setError('Vui lòng nhập đầy đủ mã xác thực');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Giả lập API xác thực OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Chuyển sang bước tiếp theo
      onSubmit(otpValue);
    } catch {
      setError('Mã xác thực không hợp lệ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    
    try {
      await onResend();
      setCountdown(60); // Reset countdown
    } catch {
      setError('Không thể gửi lại mã xác thực. Vui lòng thử lại sau.');
    } finally {
      setResending(false);
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
        XÁC THỰC MÃ OTP
      </Typography>

      <Typography 
        variant="body1" 
        align="center"
        sx={{ mb: 1, color: 'text.secondary' }}
      >
        Mã xác thực đã được gửi đến
      </Typography>

      <Typography 
        variant="body1" 
        align="center"
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: CAO_THANG_COLORS.primary
        }}
      >
        {email}
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
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1,
            mb: 4
          }}
        >
          {[...Array(OTP_LENGTH)].map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  padding: '10px 0',
                  width: '100%'
                }
              }}
              sx={{
                width: '3rem',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Chưa nhận được mã?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleResend}
              sx={{
                color: countdown > 0 ? 'text.disabled' : CAO_THANG_COLORS.secondary,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: countdown > 0 ? 'none' : 'underline',
                },
                cursor: countdown > 0 ? 'default' : 'pointer',
              }}
            >
              {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
            </Link>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onBack}
            sx={{
              py: 1.5,
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || resending}
            sx={{
              py: 1.5,
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {loading ? 'Đang xử lý...' : 'Xác thực'}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default OtpStep; 