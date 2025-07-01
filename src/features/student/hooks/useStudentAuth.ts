import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LoginSchema, type LoginSchemaType } from "../schemas/validation";
import { StudentApiService } from "../services/api";
import type { ContestantInfo, LoginFormErrors } from "../types";

export const useStudentAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const login = useCallback(
    async (formData: LoginSchemaType) => {
      setIsLoading(true);
      setErrors({});

      try {
        const validatedData = LoginSchema.parse(formData);

        const response = await StudentApiService.login(validatedData);
        if (response.success) {
          navigate("/student/dashboard");
          return { success: true, data: response.data };
        } else {
          setErrors({ general: response.message });
          return { success: false, error: response.message };
        }
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Đăng nhập thất bại" }; // ✅ Thêm dòng này
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  // const logout = useCallback(() => {
  //   StudentApiService.logout();
  //   navigate("/student/login");
  // }, [navigate]);

  const getContestantInfo = useCallback((): ContestantInfo | null => {
    return StudentApiService.getContestantInfo();
  }, []);

  const isAuthenticated = useCallback((): boolean => {
    return StudentApiService.isAuthenticated();
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    login,
    // logout,
    getContestantInfo,
    isAuthenticated,
    clearErrors,
    isLoading,
    errors,
  };
};
