import axiosInstance from "../../../../config/axiosInstance";
import {
  UserShema,
  UpdateUserSchema,
  CreateUserSchema,
} from "../types/user.shame";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

export const CreateUser = async () => {
  const res = await axiosInstance.post("/user");
  return res.data;
};
export default { getAllUsers };
