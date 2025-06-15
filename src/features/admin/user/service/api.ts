import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type UserQuery,
  type deleteUsersType,
} from "../types/user.shame";

export const getAllUsers = async (params: UserQuery = {}) => {
  const res = await axiosInstance.get("/user", { params });
  return res.data;
};
export const getUserById = async (id: number | null) => {
  const res = await axiosInstance.get(`/user/${id}`);
  return res.data.data;
};

export const CreateUser = async (payload: CreateUserInput) => {
  const res = await axiosInstance.post("/user", payload);
  return res.data;
};

export const UpdateUser = async (id: number, payload: UpdateUserInput) => {
  const res = await axiosInstance.patch(`/user/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/user/${id}/toggle-active`);
  return res.data;
};

export const DeleteUssers = async (ids: deleteUsersType) => {
  const res = await axiosInstance.post("/user/delete-many", ids);
  return res.data;
};

export const DeleteUser = async (id: number) => {
  const res = await axiosInstance.delete(`/user/${id}`);
  return res.data;
};
