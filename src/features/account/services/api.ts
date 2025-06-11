// src/auth/services/api.ts
import axiosInstance from "../../../config/axiosInstance";
const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await axiosInstance.post("/auth/change-password", data);
  return response.data;
};

export { changePassword };