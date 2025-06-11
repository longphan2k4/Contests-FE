import type { School, SchoolFilter, SchoolsResponse, ApiResponse } from '../types/school';
import axiosInstance from '../../../../config/axiosInstance';



/**
 * Lấy danh sách trường học từ API
 */
export const getSchools = async (filter?: SchoolFilter): Promise<SchoolsResponse> => {
  try {
    // Xây dựng các tham số query
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.search) params.append('search', filter.search.trim());
    if (filter?.isActive !== undefined) params.append('isActive', String(filter.isActive));

    const response = await axiosInstance.get<ApiResponse<SchoolsResponse>>('/school', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một trường học
 */
export const getSchoolById = async (id: number): Promise<School> => {
  try {
    const response = await axiosInstance.get<ApiResponse<School>>(`/school/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching school with id ${id}:`, error);
    throw error;
  }
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
 * Cập nhật trường học
 */
export const updateSchool = async (id: number, schoolData: Partial<School>): Promise<School> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<School>>(`/school/${id}`, schoolData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating school with id ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa trường học
 */
export const deleteSchool = async (ids: number[]): Promise<void> => {
  try {
    await axiosInstance.delete(`/school/${ids}`);
  } catch (error) {
    console.error(`Error deleting schools with ids ${ids}:`, error);
    throw error;
  }
};

/**
 * Chuyển đổi trạng thái hoạt động của trường học
 */
export const toggleSchoolActive = async (id: number): Promise<School> => {
  try {
    const school = await getSchoolById(id);
    return updateSchool(id, { isActive: !school.isActive });
  } catch (error) {
    console.error(`Error toggling active state for school with id ${id}:`, error);
    throw error;
  }
};