import axiosInstance from "../../../config/axiosInstance";
import type { UserType } from "../../auth/types/auth.shema";

const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await axiosInstance.post("/auth/change-password", data);
  return response.data;
};

const changeAccountInfo = async (data: { username: string; email: string }) => {
  const response = await axiosInstance.post<{ data?: UserType; message?: string }>(
    "/auth/change-info",
    data
  );
  return response.data;
};

export { changePassword, changeAccountInfo };