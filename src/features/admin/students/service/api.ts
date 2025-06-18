import axiosInstance from "../../../../config/axiosInstance";
import {
  type CreateStudentInput,
  type UpdateStudentInput,
  type StudentQuery,
  type deleteStudentsType,
} from "../types/student.shame";

export const getAllStudents = async (params: StudentQuery = {}) => {
  const res = await axiosInstance.get("/student", { params });
  return res.data;
};

export const getAllClasses = async (params: StudentQuery = {}) => {
  const res = await axiosInstance.get(`/class?limit=50`, { params });
  return res.data;
};

export const getStudentById = async (id: number | null) => {
  const res = await axiosInstance.get(`/student/${id}`);
  return res.data.data;
};

export const CreateStudent = async (payload: CreateStudentInput) => {
  const res = await axiosInstance.post("/student", payload);
  return res.data;
};

export const UpdateStudent = async (id: number, payload: UpdateStudentInput) => {
  const res = await axiosInstance.patch(`/student/${id}`, payload);
  return res.data;
};

export const ToggleActive = async (id: number) => {
  const res = await axiosInstance.patch(`/student/${id}/toggle-active`);
  return res.data;
};

export const DeleteUssers = async (ids: deleteStudentsType) => {
  const res = await axiosInstance.post("/student/delete-many", ids);
  return res.data;
};

export const DeleteStudent = async (id: number) => {
  const res = await axiosInstance.delete(`/student/${id}`);
  return res.data;
};
