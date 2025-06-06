/**
 * Các biến môi trường của ứng dụng
 */

// API URL cơ bản
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// URL để hiển thị hình ảnh - để trống vì sử dụng proxy
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || '';

/**
 * Hàm lấy đường dẫn đầy đủ của media
 * @param path Đường dẫn tương đối của media
 * @returns Đường dẫn đầy đủ
 */
export const getMediaUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${path}`;
  return `/${path}`;
}; 