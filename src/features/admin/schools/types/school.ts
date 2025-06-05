/**
 * Interface cho đối tượng trường học
 */
export interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  district: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface cho tham số lọc và tìm kiếm
 */
export interface SchoolFilter {
  search?: string;
  city?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Interface cho kết quả danh sách có phân trang
 */
export interface SchoolsResponse {
  schools: School[];
  total: number;
  page: number;
  limit: number;
} 