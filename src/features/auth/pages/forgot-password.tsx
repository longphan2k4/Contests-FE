import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  alpha,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { CAO_THANG_COLORS } from "../../../common/theme";
import {
  EmailStep,
  OtpStep,
  ResetPasswordStep,
  SuccessStep,
} from "../components/forgot-password";
import useForgotPassword from "../hooks/useFogotPassWord";
import useVerifyOtp from "../hooks/useVerifyOtp";
import useResetPassword from "../hooks/useResetPassword";

import { useToast } from "@contexts/toastContext";

const ForgotPasswordStep = {
  EMAIL: 0,
  OTP: 1,
  RESET_PASSWORD: 2,
  SUCCESS: 3,
} as const;
type ForgotPasswordStep =
  (typeof ForgotPasswordStep)[keyof typeof ForgotPasswordStep];

const steps = ["Nhập email", "Xác thực OTP", "Đặt lại mật khẩu", "Hoàn tất"];

const ForgotPasswordPage = () => {
  const [activeStep, setActiveStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    document.title = "Quên mật khẩu";
  }, []);

  const { showToast } = useToast();

  const { mutate } = useForgotPassword();
  const verifyOtpMutation = useVerifyOtp();

  // Xử lý khi người dùng nhập email và chuyển sang bước xác thực OTP
  const handleEmailSubmit = (email: string) => {
    mutate(
      { email },
      {
        onSuccess: () => {
          setEmail(email);
          setActiveStep(ForgotPasswordStep.OTP);
          showToast("Đã gửi email xác thực OTP!", "success");
        },
        onError: error => {
          // Lấy message từ response nếu có
          const errWithResponse = error as Error & { response?: any };
          const apiMessage = errWithResponse?.response?.data?.message;
          showToast(
            apiMessage || error.message || "Gửi email thất bại!",
            "error"
          );
        },
      }
    );
  };

  // Xử lý khi người dùng quay lại bước nhập email
  const handleBackToEmail = () => {
    setActiveStep(ForgotPasswordStep.EMAIL);
  };

  // Xử lý khi người dùng gửi lại mã OTP
  const handleResendOtp = async () => {
    // Giả lập gọi API gửi lại OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Xử lý khi người dùng xác thực OTP thành công và chuyển sang bước đặt lại mật khẩu
  const handleOtpSubmit = (otpValue: string) => {
    verifyOtpMutation.mutate(
      { email, otp: otpValue },
      {
        onSuccess: () => {
          setOtp(otpValue);
          setActiveStep(ForgotPasswordStep.RESET_PASSWORD);
          showToast("Xác thực OTP thành công!", "success");
        },
        onError: error => {
          const errWithResponse = error as Error & { response?: any };
          const apiMessage = errWithResponse?.response?.data?.message;
          showToast(apiMessage || error.message || "Xác thực OTP thất bại!");
        },
      }
    );
  };

  // Xử lý khi người dùng quay lại bước xác thực OTP
  const handleBackToOtp = () => {
    setActiveStep(ForgotPasswordStep.OTP);
  };

  // Xử lý khi người dùng đặt lại mật khẩu thành công
  const handleResetPassword = async (data: {
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    resetPasswordMutation.mutate(
      {
        email,
        otp,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
      {
        onSuccess: () => {
          setActiveStep(ForgotPasswordStep.SUCCESS);
          showToast("Đặt lại mật khẩu thành công!", "success");
        },
        onError: error => {
          const errWithResponse = error as Error & { response?: any };
          const apiMessage = errWithResponse?.response?.data?.message;
          showToast(
            apiMessage || error.message || "Đặt lại mật khẩu thất bại!"
          );
        },
      }
    );
  };

  // Hiển thị component tương ứng với bước hiện tại
  const renderStepContent = () => {
    switch (activeStep) {
      case ForgotPasswordStep.EMAIL:
        return <EmailStep onSubmit={handleEmailSubmit} />;

      case ForgotPasswordStep.OTP:
        return (
          <OtpStep
            email={email}
            onSubmit={handleOtpSubmit}
            onBack={handleBackToEmail}
            onResend={handleResendOtp}
          />
        );

      case ForgotPasswordStep.RESET_PASSWORD:
        return (
          <ResetPasswordStep
            onSubmit={handleResetPassword}
            onBack={handleBackToOtp}
            loading={resetPasswordMutation.status === "pending"}
          />
        );

      case ForgotPasswordStep.SUCCESS:
        return <SuccessStep />;

      default:
        return <EmailStep onSubmit={handleEmailSubmit} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(135deg, ${CAO_THANG_COLORS.primary} 0%, ${CAO_THANG_COLORS.secondary} 100%)`,
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          top: "-250px",
          right: "-150px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: alpha("#fff", 0.05),
          bottom: "-150px",
          left: "-100px",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            background: alpha("#fff", 0.9),
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Stepper hiển thị các bước */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              "& .MuiStepLabel-root .Mui-completed": {
                color: CAO_THANG_COLORS.primary,
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: CAO_THANG_COLORS.primary,
              },
            }}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Nội dung của bước hiện tại */}
          {renderStepContent()}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
