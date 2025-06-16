import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert, TextField, Link } from "@mui/material";
import { CAO_THANG_COLORS } from "../../../../common/theme";
import useForgotPassword from "../../hooks/useFogotPassWord";
import { useNotification } from "../../../../contexts/NotificationContext";
interface OtpStepProps {
  email: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
  onResend: () => Promise<void>;
}

const OTP_LENGTH = 6;

const OtpStep = ({ email, onSubmit, onBack }: OtpStepProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, _setResending] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const { mutate } = useForgotPassword();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const sendOtpSubmit = (email: string) => {
    mutate(
      { email },
      {
        onSuccess: () => {
          showSuccessNotification("Mã xác thực đã được gửi");
          setCountdown(120);
        },
        onError: () => {
          showErrorNotification(
            "Không thể gửi mã xác thực. Vui lòng thử lại sau.",
            "Lỗi"
          );
        },
      }
    );
  };

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    setOtp(pasted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ mã xác thực");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(otp);
    } catch {
      setError("Mã xác thực không hợp lệ. Vui lòng thử lại.");
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
          backgroundClip: "text",
          textFillColor: "transparent",
          mb: 2,
        }}
      >
        XÁC THỰC MÃ OTP
      </Typography>

      <Typography align="center" color="text.secondary" sx={{ mb: 1 }}>
        Mã xác thực đã được gửi đến
      </Typography>
      <Typography
        align="center"
        sx={{ mb: 3, fontWeight: 600, color: CAO_THANG_COLORS.primary }}
      >
        {email}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <TextField
            value={otp}
            onChange={handleChange}
            onPaste={handlePaste}
            inputProps={{
              maxLength: OTP_LENGTH,
              inputMode: "numeric",
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "0.5rem",
                width: "16rem",
                padding: "10px 0",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            placeholder={"●".repeat(OTP_LENGTH)}
          />
        </Box>

        <Typography align="center" variant="body2" sx={{ mb: 3 }}>
          Chưa nhận được mã?{" "}
          <Link
            component="button"
            onClick={
              countdown <= 0
                ? () => {
                    sendOtpSubmit(email);
                  }
                : undefined
            }
            sx={{
              color:
                countdown > 0 ? "text.disabled" : CAO_THANG_COLORS.secondary,
              textDecoration: countdown > 0 ? "none" : "underline",
              cursor: countdown > 0 ? "default" : "pointer",
            }}
          >
            {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã"}
          </Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onBack}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || resending}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            {loading ? "Đang xử lý..." : "Xác thực"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default OtpStep;
