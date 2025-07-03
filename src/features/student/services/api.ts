import axiosStudent from "../../../config/axiosStudent";
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

export class StudentApiService {
  /**
   * Đăng nhập thí sinh
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      // Sử dụng axiosInstance với withCredentials để nhận httpOnly cookies
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/student-login",
        loginData,
        { withCredentials: true } // Quan trọng: để nhận httpOnly cookies từ backend
      );
      
      // Lưu token và thông tin contestant
      if (response.data.success) {
        // ✅ Lưu toàn bộ object data vào localStorage
        localStorage.setItem("contestantInfo", JSON.stringify(response.data.data));
        
        // ✅ Lưu token vào localStorage để có thể thêm vào Authorization header
        localStorage.setItem("accessToken", response.data.data.accessToken);
        
        // ⚠️ Không cần set cookie bằng JavaScript vì backend đã set httpOnly cookie
        // Backend sẽ tự động set:
        // - accessToken cookie (httpOnly, 1 hour)
        // - refreshToken cookie (httpOnly, 30 days)
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
    // ✅ Chỉ kiểm tra localStorage vì httpOnly cookie không đọc được từ JS
    const localToken = this.getAccessToken();
    const contestantInfo = this.getContestantInfo();
    
    return !!(localToken && contestantInfo);
  }

  /**
   * Lấy token từ cookie - DEPRECATED vì backend dùng httpOnly cookie
   */
  private static getTokenFromCookie(): string | null {
    // ⚠️ Không thể đọc httpOnly cookie từ JavaScript
    // Chức năng này chỉ để tương thích với code cũ
    return null;
  }

  /**
   * Lấy thông tin match theo ID
   */
  static async getMatchInfo(matchId: number) {
    try {
      const response = await axiosStudent.get(`/matches/${matchId}`);
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

      const response = await axiosInstance.post("/auth/refresh-token", {
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