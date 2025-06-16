import axiosInstance from '../../../../config/axiosInstance';
import type { ContestResponse, ContestMessageResponse, ContestUpdateResponse } from '../types';
import { AxiosError } from 'axios';

export interface CreateContestData {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  rule: string;
  slogan?: string;
  isActive: boolean;
}

export interface UpdateContestData {
  name?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  rule?: string;
  slogan?: string;
  isActive?: boolean;
}

export const getContests = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ContestResponse> => {
  try {
    const response = await axiosInstance.get<ContestResponse>('/contest', { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách contest');
    }
    throw error;
  }
};    

export const getContestById = async (id: number): Promise<ContestResponse> => {
  try {
    const response = await axiosInstance.get<ContestResponse>(`/contest/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin contest');
    }
    throw error;
  }
};

export const createContest = async (data: CreateContestData): Promise<ContestResponse> => {
  try {
    console.log('data', data);
    const response = await axiosInstance.post<ContestResponse>('/contest', data);
    console.log('response create', response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo contest mới');
    }
    throw error;
  }
};

export const updateContest = async (
  id: number,
  data: UpdateContestData
): Promise<ContestUpdateResponse> => {
  try {
    const response = await axiosInstance.patch<ContestUpdateResponse>(`/contest/${id}`, data);
    console.log('response update', response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật contest');
    }
    throw error;
  }
};

export const toggleContestActive = async (id: number): Promise<ContestResponse> => {
  try {
    const response = await axiosInstance.patch<ContestResponse>(`/contest/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi thay đổi trạng thái contest');
    }
    throw error;
  }
};

export const deleteContest = async (id: number): Promise<ContestMessageResponse> => {
  try {
    const response = await axiosInstance.delete<ContestMessageResponse>(`/contest/${id}`);
    console.log('response delete', response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Lỗi khi xóa contest:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa contest');
    }
    console.error('Lỗi khi xóa contest:', error);
    throw error;
  }
};

export const deleteManyContests = async (ids: number[]): Promise<ContestMessageResponse> => {
  try {
    const response = await axiosInstance.post<ContestMessageResponse>('/contest/delete-many', { ids });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa nhiều contest');
    }
    throw error;
  }
}; 