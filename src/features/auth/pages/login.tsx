import React, { useState } from "react";
import { Box, Container, Paper, alpha } from "@mui/material";
import { LoginForm } from "../components";
import { CAO_THANG_COLORS } from "../../../common/theme";
import { LoginSchema } from "../types/auth.shema";
import type { LoginSchemaType } from "../types/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useprofile";
import { useNotification } from "../../../contexts/NotificationContext";
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });
  const {
    formState: { errors },
  } = form;
  const { mutate } = useLogin();
  const { refetch } = useProfile();
  const navigate = useNavigate();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    mutate(data, {
      onSuccess: async data => {
        setLoading(false);

        if (data.success) {
          showSuccessNotification("Đăng nhập thành công");
        }
        // Lưu accessToken vào cookie và localStorage nếu có
        if (data.data?.accessToken) {
          const expires = new Date();
          expires.setDate(expires.getDate() + 30);
          document.cookie = `feAccessToken=${
            data.data.accessToken
          }; path=/; expires=${expires.toUTCString()}`;
          localStorage.setItem("feAccessToken", data.data.accessToken);
        }
        // Đảm bảo context user được cập nhật trước khi chuyển trang
        await refetch();
        if (data.data?.role === "admin" || data.data?.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (data.data?.role === "Judge") {
          navigate("/");
        }
      },
      onError: error => {
        setLoading(false);
        const errWithResponse = error as Error & { response?: any };
        if (errWithResponse?.response?.data?.error?.details) {
          errWithResponse.response.data.error.details.forEach(
            (err: { field: string; message: string }) => {
              if (err.field === "identifier" || err.field === "password") {
                form.setError(err.field as "identifier" | "password", {
                  message: err.message,
                });
              }
            }
          );
          showErrorNotification("Đăng nhập thất bại:");
        } else if (errWithResponse?.response?.data?.message) {
          showErrorNotification(errWithResponse.response.data.message);
        } else {
          showErrorNotification("Đăng nhập thất bại, vui lòng thử lại sau.");
        }
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(135deg, ${CAO_THANG_COLORS.primary} 0%, ${CAO_THANG_COLORS.secondary} 100%)`,
          position: "relative",
          overflow: "hidden",
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
            <LoginForm
              loading={loading}
              onSubmit={onSubmit}
              errors={errors}
              formMethods={form}
            />
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
