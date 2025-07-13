import axiosStudent from "../../../config/axiosStudent";
import axiosInstance from "../../../config/axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RegisterErrorResponse,
  RegisterApiResponse,
  ClassListResponse,
} from "../types";

// Interface cho error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: {
        type: string;
        details: Array<{ field: string; message: string }>;
      };
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
        // ✅ Lưu feAccessToken vào cookie để kiểm tra trạng thái đăng nhập
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `feAccessToken=${true}; path=/; expires=${expires.toUTCString()}`;

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
   * Đăng ký thí sinh
   */
  static async register(
    registerData: RegisterRequest
  ): Promise<RegisterResponse> {
    try {
      const response = await axiosInstance.post<RegisterApiResponse>(
        "/auth/register-student",
        registerData
      );

      // Kiểm tra nếu response là error
      if (!response.data.success) {
        const errorResponse = response.data as RegisterErrorResponse;
        throw new Error(errorResponse.message || "Đăng ký thất bại");
      }

      return response.data as RegisterResponse;
    } catch (error: unknown) {
      const apiError = error as ApiError;

      // Xử lý lỗi API với cấu trúc mới
      if (apiError.response?.data) {
        const errorData = apiError.response.data;

        // Nếu có validation errors
        if (
          errorData.error?.type === "VALIDATION_ERROR" &&
          errorData.error.details
        ) {
          throw new Error(
            JSON.stringify({
              type: "VALIDATION_ERROR",
              details: errorData.error.details,
            })
          );
        }

        // Nếu có message chung
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }

      throw new Error("Có lỗi xảy ra trong quá trình đăng ký");
    }
  }

  /**
   * Lấy thông tin profile thí sinh từ API
   */
  static async getProfileStudent() {
    try {
      const response = await axiosStudent.get("/auth/profile-student");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error("Không thể lấy thông tin thí sinh");
    }
  }


  /**
   * Kiểm tra xem thí sinh đã đăng nhập chưa
   */
  static isAuthenticated(): boolean {
    // ✅ Chỉ kiểm tra cookie vì không sử dụng localStorage
    return document.cookie.includes("feAccessToken=");
  }

  /**
   * Lấy token từ cookie - DEPRECATED vì backend dùng httpOnly cookie
   */
  // private static getTokenFromCookie(): string | null {
  //   // ⚠️ Không thể đọc httpOnly cookie từ JavaScript
  //   // Chức năng này chỉ để tương thích với code cũ
  //   return null;
  // }

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
   * Lấy danh sách lớp và trường
   */
  static async getClassList(): Promise<ClassListResponse> {
    try {
      const response = await axiosInstance.get<ClassListResponse>(
        "/class/list-with-school"
      );

      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      // Xử lý lỗi API
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error("Có lỗi xảy ra khi lấy danh sách lớp");
    }
  }

  /**
   * Refresh token manually
   */
  static async refreshToken(): Promise<boolean> {
    try {
      // ✅ Không cần lấy refreshToken từ localStorage vì backend sẽ đọc từ httpOnly cookie
      const response = await axiosInstance.get("/auth/refresh-token", {
        withCredentials: true, // Quan trọng: để gửi httpOnly refresh cookie
      });

      if (response.data.success) {
        // ✅ Backend sẽ tự động set cookie mới, không cần lưu vào localStorage
        return true;
      }
      return false;
    } catch (error) {
      console.error("Manual refresh token failed:", error);
      return false;
    }
  }

  /**
   * Lấy registrationNumber cho thí sinh trong trận đấu
   */
  static async getRegistrationNumber(contestantId: number, matchId: number) {
    try {
      const response = await axiosInstance.get(
        `/auth/registration-number?contestantId=${contestantId}&matchId=${matchId}`
      );
      console.log("response waiting", response.data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      throw new Error("Không thể lấy registrationNumber");
    }
  }
}

export default StudentApiService;
