import axios from 'axios';
import type { About, AboutData } from '../types/about';
import { API_URL } from '../../../../config/env';
import axiosInstance from '../../../../config/axiosInstance';

/**
 * Lấy thông tin About từ API
 */
export const getAboutInfo = async (): Promise<About> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/about/1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching about info:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin About và upload file
 * @param aboutData Dữ liệu cập nhật
 * @param logoFile File logo (nếu có)
 * @param bannerFile File banner (nếu có)
 * @returns Thông tin About đã cập nhật
 */
export const updateAboutInfo = async (
  aboutData: Partial<AboutData>, 
  logoFile?: File | null, 
  bannerFile?: File | null
): Promise<About> => {
  try {
    // Sử dụng FormData để gửi cả dữ liệu và file
    const formData = new FormData();
    
    // Thêm từng trường dữ liệu riêng biệt thay vì gửi cả object
    if (aboutData.schoolName) formData.append('schoolName', aboutData.schoolName);
    if (aboutData.departmentName) formData.append('departmentName', aboutData.departmentName);
    if (aboutData.email) formData.append('email', aboutData.email);
    if (aboutData.website) formData.append('website', aboutData.website);
    if (aboutData.fanpage) formData.append('fanpage', aboutData.fanpage);
    if (aboutData.mapEmbedCode) formData.append('mapEmbedCode', aboutData.mapEmbedCode);
    
    // Thêm file nếu có
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    
    // Log để kiểm tra dữ liệu
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    
    // Gửi request với content-type là multipart/form-data
    const response = await axios.put(`${API_URL}/about/1`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating about info:', error);
    throw error;
  }
};



