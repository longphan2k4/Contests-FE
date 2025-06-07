import axiosInstance from "../../../config/axiosInstance";
import {
  type LoginSchemaType,
  type ForgotPasswordSchemaType,
  type VerifyOtpSchemaType,
  type ResetPasswordSchemaType,
} from "../types/auth.shema";
const login = async (data: LoginSchemaType) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};
const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};
const forgotPassword = async (data: ForgotPasswordSchemaType) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};
const verifyOtp = async (data: VerifyOtpSchemaType) => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};
const resetPassword = async (data: ResetPasswordSchemaType) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export { login, logout, getProfile, forgotPassword, verifyOtp, resetPassword };
