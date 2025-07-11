import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Fade,
  Alert,
  Skeleton,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ErrorOutline, Home } from "@mui/icons-material"; // Thêm Home
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/authContext";
import { useProfile } from "../../auth/hooks/useprofile";
import useChangePassword from "../hooks/useChangePassword";
import useChangeAccountInfo from "../hooks/useChangeAccountInfo";

import { CAO_THANG_COLORS } from "../../../common/theme"; // Thêm theme
import ProfileLayout from "../components/ProfileLayout";
import AccountInfo from "../components/AccountInfo";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ChangeAccountInfoForm from "../components/ChangeAccountInfoForm";
import type { ChangePasswordData } from "../types/ChangePasswordForm.types";
import type { ChangeAccountInfoData } from "../types/ChangeAccountInfoForm.types";
import type { UserType } from "../../auth/types/auth.shema";
import { useToast } from "@contexts/toastContext";

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, setUser } = useAuth();
  const { isFetching, refetch } = useProfile();
  const { mutate: changePassword, status: changePasswordStatus } =
    useChangePassword();
  const { mutate: changeAccountInfo, status: changeAccountInfoStatus } =
    useChangeAccountInfo();

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "Thông tin tài khoản";
    setMounted(true);
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { showToast } = useToast();

  const handleChangePassword = (formData: ChangePasswordData) => {
    setError("");
    changePassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      },
      {
        onSuccess: () => {
          showToast("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
          setTimeout(() => {
            document.cookie =
              "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }, 1500);
        },
        onError: (error: any) => {
          const apiMessage = error.response?.data?.message;
          const errorMsg =
            apiMessage || "Đổi mật khẩu thất bại! Vui lòng thử lại.";
          showToast(errorMsg, "error");
          setError(errorMsg);
        },
      }
    );
  };

  const handleChangeAccountInfo = (formData: ChangeAccountInfoData) => {
    setError("");
    changeAccountInfo(
      {
        username: formData.username,
        email: formData.email,
      },
      {
        onSuccess: async (data: { data?: UserType; message?: string }) => {
          showToast("Cập nhật thông tin thành công!", "success");
          if (data?.data) {
            setUser(data.data);
          } else {
            await refetch();
          }
          setTimeout(() => {
            navigate("/account/profile");
          }, 1500);
        },
        onError: (error: any) => {
          const apiMessage = error.response?.data?.message;
          const errorMsg =
            apiMessage || "Cập nhật thông tin thất bại! Vui lòng thử lại.";
          showToast(errorMsg, "error");
          setError(errorMsg);
        },
      }
    );
  };

  const handleNavigateHome = () => {
    navigate("/", { replace: true });
  };

  const LoadingSkeleton = () => (
    <Box sx={{ space: 3 }}>
      <Card sx={{ mb: 4, borderRadius: "16px" }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="circular" width={64} height={64} sx={{ mr: 3 }} />
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" width="100%" height={48} />
        </CardContent>
      </Card>
    </Box>
  );

  const ErrorState = () => (
    <Fade in timeout={600}>
      <Alert
        severity="error"
        icon={<ErrorOutline />}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "error.light",
          p: 3,
          "& .MuiAlert-icon": { fontSize: "28px" },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Không thể tải thông tin tài khoản
        </Typography>
        <Typography variant="body2">
          Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ.
        </Typography>
      </Alert>
    </Fade>
  );

  return (
    <ProfileLayout>
      {/* Thêm nút Home */}
      <Tooltip title="Về trang chủ">
        <IconButton
          onClick={handleNavigateHome}
          aria-label="Về trang chủ"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            backgroundColor: CAO_THANG_COLORS.primary,
            color: "#fff",
            "&:hover": {
              backgroundColor: CAO_THANG_COLORS.secondary,
            },
            zIndex: 1200,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Home />
        </IconButton>
      </Tooltip>

      <Fade in={mounted} timeout={800}>
        <Box>
          {authLoading || isFetching ? (
            <LoadingSkeleton />
          ) : user ? (
            <Box
              sx={{
                "& > *": {
                  opacity: 0,
                  animation: "slideInUp 0.6s ease-out forwards",
                },
                "& > *:nth-of-type(2)": { animationDelay: "0.2s" },
                "& > *:nth-of-type(3)": { animationDelay: "0.4s" },
                "@keyframes slideInUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <AccountInfo user={user} />
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                error={error}
                changePasswordStatus={changePasswordStatus}
              />
              <ChangeAccountInfoForm
                onSubmit={handleChangeAccountInfo}
                error={error}
                changeAccountInfoStatus={changeAccountInfoStatus}
                initialData={{ username: user.username, email: user.email }}
              />
            </Box>
          ) : (
            <ErrorState />
          )}
        </Box>
      </Fade>
    </ProfileLayout>
  );
};

export default ProfilePage;
