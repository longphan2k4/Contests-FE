import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/auth/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
