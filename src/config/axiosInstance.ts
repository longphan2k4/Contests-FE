// src/lib/axiosInstance.ts
import axios from "axios";

// Lấy URL từ biến môi trường
const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Đảm bảo cookie được gửi cùng request
});

// Interceptor xử lý response
axiosInstance.interceptors.response.use(
  response => response, // Nếu không lỗi thì trả về response bình thường
  async error => {
    const originalRequest = error.config;

    // Nếu bị 403 (Forbidden) → Chuyển hướng đến trang báo lỗi
    if (error.response && error.response.status === 403) {
      console.error("Forbidden request:", error);
      window.location.href = "/403";
      return Promise.reject(error);
    }

    // Nếu bị 401 (Unauthorized) và request chưa được retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Nếu lỗi do token không khớp trong DB (backend trả message cụ thể)
      const code = error.response.data?.code;
      if (code === "USER_NOT_FOUND_OR_INACTIVE") {
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("refreshToken");

        // Chuyển hướng login
        alert("Tài khoản đã bị khóa");
        window.location.href = "/login";
        return Promise.reject(error);
      } else if (code === "INVALID_OR_EXPIRED_TOKEN") {
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("refreshToken");

        // Chuyển hướng login
        alert("Tài khoản đã đăng nhập trên thiết bị khác");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Không retry nếu đang gọi refresh-token (tránh lặp vô hạn)
      if (originalRequest.url.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      // Đánh dấu request đã retry
      originalRequest._retry = true;

      try {
        // Thử gọi refresh-token
        await axiosInstance.get("/auth/refresh-token");

        // Gửi lại request gốc
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Xoá cookie frontend
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("refreshToken");

        // Chuyển hướng login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // Các lỗi khác → trả về lỗi
    return Promise.reject(error);
  }
);

export default axiosInstance;
