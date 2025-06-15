import axiosInstance from "../../../../config/axiosInstance";
import { type CreateStudentInput } from "../types/student.shame";

// export const getAllStudents = async () => {
//   const res = await axiosInstance.get("/student?all=true");
//   return res.data.data.students;
// };

export type StudentQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export const getAllStudents = async (params: StudentQuery = {}) => {
  const cleanedParams = { ...params };
  if (!cleanedParams.search) delete cleanedParams.search;
  const res = await axiosInstance.get("/student", { params: cleanedParams });
  console.log(res.data)
  return res.data;
};


export const getStudentById = async (id: number) => {
  const res = await axiosInstance.get(`/student/${id}`);
  return res.data.data;
};

export const CreateStudent = async (payload: CreateStudentInput) => {
  try {
    const res = await axiosInstance.post("/student", payload);
    return res.data;
  } catch (error) {
    console.error("Error creating student", error);
    throw error;
  }
};


export const DeleteStudent = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/student/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting student", error);
    throw error;
  }
};

export const toggleStudentActive = async (id: number) => {
  try {
    const res = await axiosInstance.patch(`/student/${id}/toggle-active`);
    return res.data;
  } catch (error) {
    console.error("Error toggling student active status", error);
    throw error;
  }
};

export const updateStudent = async (
  id: number,
  data: {
    fullName: string;
    studentCode: string;
    classId?: number;
    isActive: boolean;
  }
) => {
  try {
    const res = await axiosInstance.patch(`/student/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating student", error);
    throw error;
  }
};