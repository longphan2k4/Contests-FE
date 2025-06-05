/**
 * Định nghĩa interface AboutData - dữ liệu chính
 */
export interface AboutData {
  departmentName: string;
  email: string;
  fanpage: string;
  isActive: boolean;
  mapEmbedCode: string;
  schoolName: string;
  website: string;
  logo:string
  banner:string

}

/**
 * Định nghĩa interface About - cấu trúc đầy đủ từ backend
 */
export interface About {
  data: AboutData;
}

/**
 * Định nghĩa interface API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}