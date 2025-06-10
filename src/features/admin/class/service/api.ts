import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateClassInput,
  type UpdateClassInput,
  type ClassQuery,
  type deleteClasssType,
} from "../types/class.shame";

export const getAllclasss = async (params: ClassQuery = {}) => {
  const res = await axiosInstance.get("/class", { params });
  return res.data;
};
export const getClassById = async (id: number | null) => {
  const res = await axiosInstance.get(`/class/${id}`);
  return res.data.data;
};

export const CreateClass = async (payload: CreateClassInput) => {
  const res = await axiosInstance.post("/class", payload);
  return res.data;
};

export const UpdateClass = async (id: number, payload: UpdateClassInput) => {
  const res = await axiosInstance.patch(`/class/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/class/${id}/toggle-active`);
  return res.data;
};

export const DeleteClasses = async (ids: deleteClasssType) => {
  const res = await axiosInstance.post("/class/delete-many", ids);
  return res.data;
};

export const listSchool = async () => {
  const res = await axiosInstance.get("/school/list-school");
  return res.data;
};
