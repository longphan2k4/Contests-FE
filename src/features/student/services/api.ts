import axiosInstance from "../../../config/axiosInstance";
import type { LoginRequest, LoginResponse, ContestantInfo } from "../types";

// Interface cho error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Tạo instance riêng cho student từ axiosInstance chung
const studentApiClient = axiosInstance.create();

// Override request interceptor để thêm Bearer token cho student
studentApiClient.interceptors.request.clear(); // Clear interceptors cũ
studentApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Override response interceptor cho student-specific logic
studentApiClient.interceptors.response.clear(); // Clear interceptors cũ
studentApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu bị 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token cho student (token-based)
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshResponse = await axiosInstance.post("/auth/student-refresh-token", {
            refreshToken
          });

          if (refreshResponse.data.success) {
            // Cập nhật token mới
            localStorage.setItem("accessToken", refreshResponse.data.data.accessToken);
            if (refreshResponse.data.data.refreshToken) {
              localStorage.setItem("refreshToken", refreshResponse.data.data.refreshToken);
            }

            // Thử lại request gốc với token mới
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
            return studentApiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Student refresh token failed:", refreshError);
      }

      // Chỉ redirect nếu không phải đang ở trang login
      if (window.location.pathname !== "/student/login") {
        window.location.href = "/student/login";
      }
    }

    return Promise.reject(error);
  }
);

export class StudentApiService {
  /**
   * Đăng nhập thí sinh
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await studentApiClient.post<LoginResponse>(
        "/auth/student-login",
        loginData
      );
      
      // Lưu token và thông tin contestant
      if (response.data.success) {
        // ✅ Lưu vào cookie để socket có thể đọc được (giống như Admin)
        const expires = new Date();
        expires.setTime(expires.getTime() + (60 * 60 * 1000)); // 1 hour
        
        document.cookie = `accessToken=${response.data.data.accessToken}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
        
        // Lưu refresh token nếu có
        if (response.data.data.refreshToken) {
          const refreshExpires = new Date();
          refreshExpires.setTime(refreshExpires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
          document.cookie = `refreshToken=${response.data.data.refreshToken}; path=/; expires=${refreshExpires.toUTCString()}; SameSite=Lax`;
        }
        
        // Lưu toàn bộ object data vào localStorage
        localStorage.setItem("contestantInfo", JSON.stringify(response.data.data));
        
        // ✅ Cũng lưu token vào localStorage để tương thích với code cũ
        localStorage.setItem("accessToken", response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }
      }
      
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      // Xử lý lỗi API
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error("Có lỗi xảy ra trong quá trình đăng nhập");
    }
  }

  /**
   * Lấy thông tin contestant từ localStorage
   */
  static getContestantInfo(): ContestantInfo | null {
    try {
      const stored = localStorage.getItem("contestantInfo");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Lấy access token từ localStorage
   */
  static getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  /**
   * Lấy refresh token từ localStorage
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Kiểm tra xem thí sinh đã đăng nhập chưa
   */
  static isAuthenticated(): boolean {
    // ✅ Kiểm tra token từ cookie trước (ưu tiên)
    const cookieToken = this.getTokenFromCookie();
    const localToken = this.getAccessToken();
    const contestantInfo = this.getContestantInfo();
    
    return !!((cookieToken || localToken) && contestantInfo);
  }

  /**
   * Lấy token từ cookie
   */
  private static getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return value;
      }
    }
    return null;
  }

  /**
   * Lấy thông tin match theo ID
   */
  static async getMatchInfo(matchId: number) {
    try {
      const response = await studentApiClient.get(`/matches/${matchId}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error("Không thể lấy thông tin trận đấu");
    }
  }

  /**
   * Cập nhật thông tin contestant trong localStorage
   */
  static updateContestantInfo(contestantInfo: ContestantInfo): void {
    localStorage.setItem("contestantInfo", JSON.stringify(contestantInfo));
  }

  /**
   * Refresh token manually
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await axiosInstance.post("/auth/student-refresh-token", {
        refreshToken
      });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Manual refresh token failed:", error);
      return false;
    }
  }
}

export default StudentApiService; 