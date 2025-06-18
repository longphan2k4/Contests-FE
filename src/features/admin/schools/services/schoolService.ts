import axiosInstance from '../../../../config/axiosInstance';
import type { School, SchoolFilter, ApiResponse, SchoolsResponse } from '../types/school';

export interface DeleteSchoolsResponse {
  success: boolean;
  messages: Array<{
    status: "success" | "error";
    msg: string;
  }>;
}

/**
 * Lấy danh sách trường học từ API
 */
export const getSchools = async (filter?: SchoolFilter): Promise<SchoolsResponse> => {
  // Xây dựng các tham số query
  const params = new URLSearchParams();
  if (filter?.page) params.append('page', String(filter.page));
  if (filter?.limit) params.append('limit', String(filter.limit));
  if (filter?.search) params.append('search', filter.search.trim());
  if (filter?.isActive !== undefined) params.append('isActive', String(filter.isActive));

  const response = await axiosInstance.get<ApiResponse<SchoolsResponse>>('/school', { params });
  return response.data.data;
};

/**
 * Lấy chi tiết một trường học
 */
export const getSchoolById = async (id: number): Promise<School> => {
  const response = await axiosInstance.get<ApiResponse<School>>(`/school/${id}`);
  return response.data.data;
};

/**
 * Tạo trường học mới
 */
export const createSchool = async (schoolData: Partial<School>): Promise<School> => {
  try {
    const response = await axiosInstance.post<ApiResponse<School>>('/school', schoolData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin trường học
 */
export const updateSchool = async (id: number, data: Partial<School>): Promise<School> => {
  const response = await axiosInstance.put<ApiResponse<School>>(`/school/${id}`, data);
  return response.data.data;
};

/**
 * Xóa nhiều trường học
 */
export const deleteSchool = async (ids: number[]): Promise<DeleteSchoolsResponse> => {
  try {
    console.log('Request xóa trường học:', { ids });
    const response = await axiosInstance.post<DeleteSchoolsResponse>('/school/delete-many', {
      ids
    });
    console.log('Response xóa trường học:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting schools with ids ${ids}:`, error);
    throw error;
  }
};

/**
 * Chuyển đổi trạng thái hoạt động của trường học
 */
export const toggleSchoolActive = async (id: number): Promise<School> => {
  const school = await getSchoolById(id);
  return updateSchool(id, { isActive: !school.isActive });
};