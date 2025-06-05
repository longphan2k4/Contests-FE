import axios from 'axios';
import type { School, SchoolFilter, SchoolsResponse, ApiResponse } from '../types/school';
import { API_URL } from '../../../../config/env';
import { loginFake } from './loginFake';

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để tự động đăng nhập nếu cần
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await loginFake();
      // Thử lại request ban đầu
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

/**
 * Lấy danh sách trường học từ API
 */
export const getSchools = async (filter?: SchoolFilter): Promise<SchoolsResponse> => {
  try {
    // Xây dựng các tham số query
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.search) params.append('search', filter.search);
    if (filter?.isActive !== undefined) params.append('isActive', String(filter.isActive));

    const response = await api.get<ApiResponse<SchoolsResponse>>('/school', { params });
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
    const response = await api.get<ApiResponse<School>>(`/school/${id}`);
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
    const response = await api.post<ApiResponse<School>>('/school', schoolData);
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
    const response = await api.put<ApiResponse<School>>(`/school/${id}`, schoolData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating school with id ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa trường học
 */
export const deleteSchool = async (id: number): Promise<void> => {
  try {
    await api.delete(`/school/${id}`);
  } catch (error) {
    console.error(`Error deleting school with id ${id}:`, error);
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