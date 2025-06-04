import axios from 'axios';
import type { About, AboutData } from '../types/about';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Lấy thông tin About từ API
 */
export const getAboutInfo = async (): Promise<About> => {
  try {
    const response = await axios.get(`${API_URL}/about/1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching about info:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin About
 */
export const updateAboutInfo = async (aboutData: Partial<AboutData>): Promise<About> => {
  try {
    const response = await axios.put(`${API_URL}/about/1`, aboutData);
    return response.data;
  } catch (error) {
    console.error('Error updating about info:', error);
    throw error;
  }
};