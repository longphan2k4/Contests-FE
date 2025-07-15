import axiosInstance from "./axiosInstance";

/**
 * Utility để lấy token từ localStorage
 */
function getTokenFromLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Axios instance chuyên dụng cho Student API
 * Backend sử dụng httpOnly cookie authentication, không cần Authorization header
 */
const axiosStudent = axiosInstance.create({
  withCredentials: true, // Quan trọng: để browser tự động gửi httpOnly cookies
});

// Request interceptor - không cần thêm Authorization header vì backend dùng cookie
axiosStudent.interceptors.request.use(
  (config) => {
    // Backend authenticate thông qua req.cookies.accessToken
    // Không cần thêm Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle token expiry và auto refresh
axiosStudent.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu bị 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token - backend sẽ đọc từ httpOnly cookie
        const refreshResponse = await axiosInstance.get("/auth/refresh-token", {
          withCredentials: true, // Quan trọng: để gửi httpOnly refresh cookie
        });

        if (refreshResponse.data.success) {
          // Backend sẽ set cookie mới và response không có accessToken trong data
          // Chỉ cần thử lại request gốc vì cookie đã được update
          return axiosStudent(originalRequest);
        }
      } catch (refreshError) {
        console.error("Student auto refresh token failed:", refreshError);
        // Xóa token cũ trong localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("contestantInfo");
      }

      // Redirect to student login if refresh fails
      if (!window.location.pathname.includes("/student/login")) {
        window.location.href = "/student/login";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Debug utility để kiểm tra token info
 */
export const debugStudentToken = () => {
  const localToken = getTokenFromLocalStorage("accessToken");
  const contestantInfo = getTokenFromLocalStorage("contestantInfo");

  return {
    localToken,
    hasContestantInfo: !!contestantInfo,
    withCredentials: true,
  };
};

export default axiosStudent;
