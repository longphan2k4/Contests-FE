import axios from 'axios';
import type { About } from '../types/about';
import { mockAboutData } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Lấy thông tin About từ API
 */
export const getAboutInfo = async (): Promise<About> => {
  try {
    const response = await axios.get(`${API_URL}/about`);
    return response.data;
  } catch (error) {
    console.error('Error fetching about info:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin About
 */
export const updateAboutInfo = async (aboutData: About): Promise<About> => {
  try {
    const response = await axios.put(`${API_URL}/about/${aboutData.id}`, aboutData);
    return response.data;
  } catch (error) {
    console.error('Error updating about info:', error);
    throw error;
  }
};

/**
 * Lấy dữ liệu mẫu khi chưa có API
 */
export const getMockAboutInfo = (): About => {
  return mockAboutData;
}; 