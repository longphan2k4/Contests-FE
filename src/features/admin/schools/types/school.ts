/**
 * Interface cho đối tượng trường học
 */
export interface School {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface cho tham số lọc và tìm kiếm
 */
export interface SchoolFilter {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

/**
 * Interface cho kết quả phân trang
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Interface cho kết quả danh sách có phân trang
 */
export interface SchoolsResponse {
  school: School[];
  pagination: Pagination;
}

/**
 * Interface cho lỗi validation từ backend 
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Interface cho API response with error
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
 * Interface cho API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}