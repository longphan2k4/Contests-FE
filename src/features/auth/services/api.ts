import axiosInstance from "../../../config/axiosInstance";
import { type LoginSchemaType } from "../types/auth.shema";
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

export { login, logout, getProfile };
