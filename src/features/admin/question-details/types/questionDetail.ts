/**
 * Interface cho đối tượng chi tiết câu hỏi trong gói
 */
export interface QuestionDetail {
  questionId: number;
  questionPackageId: number;
  questionOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  question?: Question;
  questionPackage?: QuestionPackage;
}

/**
 * Interface cho đối tượng câu hỏi
 */
export interface Question {
  id: number;
  title: string;
  content: string;
}

/**
 * Interface cho đối tượng gói câu hỏi
 */
export interface QuestionPackage {
  id: number;
  name: string;
  description: string;
}

/**
 * Interface cho bộ lọc câu hỏi
 */
export interface QuestionDetailFilter {
  page?: number;
  limit?: number;
  questionId?: number;
  questionPackageId?: number;
  isActive?: boolean;
  search?: string;
}

/**
 * Interface cho kết quả phân trang
 */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Interface cho kết quả danh sách có phân trang
 */
export interface QuestionDetailResponse {
  questionDetails: QuestionDetail[];
  pagination: Pagination;
}

/**
 * Interface cho đối tượng dùng khi thêm mới
 */
export type QuestionDetailFormData = {
  questionId: number;
  questionPackageId: number;
  questionOrder: number;
  isActive: boolean;
};

/**
 * Interface cho đối tượng dùng khi sắp xếp lại
 */
export interface QuestionOrderUpdate {
  questionId: number;
  questionOrder: number;
}

/**
 * Interface cho request sắp xếp lại
 */
export interface ReorderRequest {
  questionPackageId: number;
  questionOrders: QuestionOrderUpdate[];
}

/**
 * Interface cho kết quả thống kê
 */
export interface QuestionDetailStats {
  overview: {
    totalQuestionDetails: number;
    activeQuestionDetails: number;
    inactiveQuestionDetails: number;
    totalQuestions: number;
    totalPackages: number;
  };
  packageStats: {
    questionPackageId: number;
    packageName: string;
    totalQuestions: number;
    activeQuestions: number;
    inactiveQuestions: number;
  }[];
  questionStats: {
    questionId: number;
    questionTitle: string;
    totalPackages: number;
    activeInPackages: number;
    inactiveInPackages: number;
  }[];
}

/**
 * Interface cho API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Interface cho API error response
 */
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    type: string;
    details: ValidationError[];
  };
  timestamp: string;
}

/**
 * Interface cho lỗi validation
 */
export interface ValidationError {
  field: string;
  message: string;
} 