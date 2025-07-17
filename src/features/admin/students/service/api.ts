import axiosInstance from "../../../../config/axiosInstance";
import {
  type StudentQuery,
  type deleteStudentsType,
} from "../types/student.shame";

export const getAllStudents = async (params: StudentQuery = {}) => {
  const res = await axiosInstance.get("/student", { params });
  return res.data;
};

export const getAllClasses = async () => {
  const res = await axiosInstance.get(`/class/list-class`);
  return res.data;
};

export const getStudentById = async (id: number | null) => {
  const res = await axiosInstance.get(`/student/${id}`);
  return res.data.data;
};

export const CreateStudent = async (payload: FormData) => {
  const res = await axiosInstance.post("/student", payload);
  return res.data;
};

export const UpdateStudent = async (id: number, payload: FormData) => {
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

export const ListStudents = async () => {
  const res = await axiosInstance.get("/user/get-student");
  return res.data;
};

export const getListStudentCurrent = async (userId: string | null) => {
  if (!userId) {
    return;
  }
  const res = await axiosInstance.get(`/user/get-student/${userId}`);
  return res.data;
};

export const ImportExcel = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("/student/import/excel", formData);
  return res.data;
};
