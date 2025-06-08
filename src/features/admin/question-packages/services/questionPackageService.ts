import axiosInstance from "../../../../config/axiosInstance";

export interface QuestionPackage {
  id: number;
  name: string;
  isActive: boolean;
  questionDetailsCount: number;
  matchesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPackageDetail extends QuestionPackage {
  questionDetails: {
    questionOrder: number;
    isActive: boolean;
    question: {
      id: number;
      plainText: string;
      questionType: string;
      difficulty: string;
    };
  }[];
  matches: {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export interface CreateQuestionPackageDto {
  name: string;
  isActive?: boolean;
}

export interface UpdateQuestionPackageDto {
  name?: string;
  isActive?: boolean;
}

const BASE_URL = "/question-packages";

export const questionPackageService = {
  // Lấy danh sách gói câu hỏi có phân trang
  getAll: async (params: PaginationParams) => {
    const response = await axiosInstance.get<PaginatedResponse<QuestionPackage>>(BASE_URL, {
      params,
    });
    return response.data;
  },

  // Lấy chi tiết một gói câu hỏi
  getById: async (id: number) => {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: QuestionPackageDetail;
      timestamp: string;
    }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Tạo mới gói câu hỏi
  create: async (data: CreateQuestionPackageDto) => {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: QuestionPackage;
      timestamp: string;
    }>(BASE_URL, data);
    return response.data;
  },

  // Cập nhật gói câu hỏi
  update: async (id: number, data: UpdateQuestionPackageDto) => {
    const response = await axiosInstance.put<{
      success: boolean;
      message: string;
      data: QuestionPackage;
      timestamp: string;
    }>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Xóa mềm gói câu hỏi
  delete: async (id: number) => {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
      data: null;
      timestamp: string;
    }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Lấy danh sách gói câu hỏi đang hoạt động
  getActive: async () => {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: { id: number; name: string }[];
      timestamp: string;
    }>(`${BASE_URL}/active`);
    return response.data;
  },
};
