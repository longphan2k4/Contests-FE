import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403) {
      console.error("Forbidden request:", error);
      window.location.href = "/";
      return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true && originalRequest.url !== "/auth/refresh-token";
      try {
        await axiosInstance.get("/auth/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Xóa cookie feAccessToken khi refresh token thất bại
        document.cookie =
          "feAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
