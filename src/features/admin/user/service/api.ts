import axiosInstance from "../../../../config/axiosInstance";
import { type UserIdParam, type CreateUserInput } from "../types/user.shame";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await axiosInstance.get(`/user/${id}`);
  return res.data.data;
};

export const CreateUser = async (payload: CreateUserInput) => {
  const res = await axiosInstance.post("/user", payload);
  return res.data;
};

// export const UpdateUser = as;
