import axiosInstance from "../../../../config/axiosInstance";
import type { QuestionPackageList,QuestionPackage  } from "../types/questionpackages.shame"; // giả sử bạn đã có schema & types

export type QuestionPackageQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export const getAllQuestionPackages = async (params: QuestionPackageQuery = {}) => {
  const cleanedParams = { ...params };
  if (!cleanedParams.search) delete cleanedParams.search;

  const res = await axiosInstance.get("/question-packages", { params: cleanedParams });
  return res.data as QuestionPackageList;
};

export const searchQuestionPackages = async (search?: string): Promise<QuestionPackage[]> => {
  // Nếu không truyền search thì trả về tất cả
  const query = search ? `?search=${encodeURIComponent(search)}` : "?all=true";
  const res = await axiosInstance.get(`/question-packages${query}`);
  return res.data.data;
};
// Lấy gói câu hỏi theo id
export const getQuestionPackageById = async (id: number) => {
  const res = await axiosInstance.get(`/question-packages/${id}`);
  return res.data.data;
};

export const getPaginatedQuestionPackages = async (
  page: number,
  limit: number,
  searchText = ""
): Promise<{ data: QuestionPackage[]; total: number }> => {
  const query = `?page=${page}&limit=${limit}${
    searchText ? `&search=${encodeURIComponent(searchText)}` : ""
  }`;

  const res = await axiosInstance.get(`/question-packages${query}`);
  return {
    data: res.data.data,
    total: res.data.pagination.total, // LẤY total chính xác từ pagination
  };
};

// Tạo gói câu hỏi mới
export const createQuestionPackage = async (payload: Partial<QuestionPackage>) => {
  const res = await axiosInstance.post("/question-packages", payload);
  return res.data;
};

export const updateQuestionPackage = async (id: number, payload: Partial<QuestionPackage>) => {
  const res = await axiosInstance.put(`/question-packages/${id}`, payload);
  return res.data;
};


export const DeleteQuestionPackage = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/question-packages/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting Question Package", error);
    throw error;
  }
};
