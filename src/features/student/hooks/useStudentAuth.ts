import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginSchema,
  RegisterSchema,
  type LoginSchemaType,
  type RegisterSchemaType,
} from "../schemas/validation";
import { StudentApiService } from "../services/api";
import type {
  LoginFormErrors,
  RegisterFormErrors,
  Class,
  ValidationError,
} from "../types";
import { useNotification } from "../../../contexts/NotificationContext";

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
        return { success: false, error: "Đăng nhập thất bại" };
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

  // Đã bỏ getContestantInfo, mọi component lấy contestantInfo qua context

  const isAuthenticated = useCallback((): boolean => {
    return StudentApiService.isAuthenticated();
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    login,
    // logout,
    isAuthenticated,
    clearErrors,
    isLoading,
    errors,
  };
};

export const useStudentRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const { showNotification } = useNotification();

  const register = useCallback(
    async (formData: RegisterSchemaType) => {
      setIsLoading(true);
      setErrors({});

      try {
        const validatedData = RegisterSchema.parse(formData);
        // Gửi toàn bộ dữ liệu đã validate lên server
        const response = await StudentApiService.register(validatedData);
        if (response.success) {
          // Hiển thị thông báo thành công
          showNotification(
            "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
            "success",
            "Thành công",
            2000
          );

          setTimeout(() => {
            navigate("/student/login", {
              state: {
                message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
              },
            });
          }, 2000);

          return { success: true, data: response.data };
        } else {
          setErrors({ general: response.message });
          showNotification(
            response.message || "Đăng ký thất bại",
            "error",
            "Lỗi",
            3000
          );
          return { success: false, error: response.message };
        }
      } catch (error: unknown) {
        // Xử lý lỗi validation từ Zod
        if (error && typeof error === "object" && "errors" in error) {
          const validationErrors: RegisterFormErrors = {};
          (
            error as { errors: Array<{ path: string[]; message: string }> }
          ).errors.forEach((err) => {
            if (err.path) {
              validationErrors[err.path[0] as keyof RegisterFormErrors] =
                err.message;
            }
          });
          setErrors(validationErrors);
          showNotification("Dữ liệu không hợp lệ", "error", "Lỗi", 3000);
          return { success: false, error: "Dữ liệu không hợp lệ" };
        }

        // Xử lý lỗi validation từ backend
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as {
            response?: { data?: { error?: { details?: ValidationError[] } } };
          };
          if (apiError.response?.data?.error?.details) {
            const backendErrors: RegisterFormErrors = {};
            apiError.response.data.error.details.forEach(
              (err: ValidationError) => {
                // Map backend field names to frontend field names
                const fieldMap: Record<string, keyof RegisterFormErrors> = {
                  username: "username",
                  fullName: "fullName",
                  email: "email",
                  password: "password",
                  confirmPassword: "confirmPassword",
                  classId: "classId",
                };

                const frontendField = fieldMap[err.field];
                if (frontendField) {
                  backendErrors[frontendField] = err.message;
                }
              }
            );
            setErrors(backendErrors);

            // Hiển thị thông báo lỗi cụ thể từ backend
            const firstError = apiError.response.data.error.details[0];
            if (firstError) {
              showNotification(firstError.message, "error", "Lỗi", 3000);
            } else {
              showNotification("Dữ liệu không hợp lệ", "error", "Lỗi", 3000);
            }

            return { success: false, error: "Dữ liệu không hợp lệ" };
          }
        }

        // Xử lý lỗi validation được parse từ JSON string
        if (
          error instanceof Error &&
          error.message.startsWith('{"type":"VALIDATION_ERROR"')
        ) {
          try {
            const parsedError = JSON.parse(error.message);
            if (
              parsedError.type === "VALIDATION_ERROR" &&
              parsedError.details
            ) {
              const backendErrors: RegisterFormErrors = {};
              parsedError.details.forEach((err: ValidationError) => {
                // Map backend field names to frontend field names
                const fieldMap: Record<string, keyof RegisterFormErrors> = {
                  username: "username",
                  fullName: "fullName",
                  email: "email",
                  password: "password",
                  confirmPassword: "confirmPassword",
                  classId: "classId",
                };

                const frontendField = fieldMap[err.field];
                if (frontendField) {
                  backendErrors[frontendField] = err.message;
                }
              });

              setErrors(backendErrors);

              // Hiển thị thông báo lỗi cụ thể từ backend
              const firstError = parsedError.details[0];
              if (firstError) {
                showNotification(firstError.message, "error", "Lỗi", 3000);
              } else {
                showNotification("Dữ liệu không hợp lệ", "error", "Lỗi", 3000);
              }

              return { success: false, error: "Dữ liệu không hợp lệ" };
            }
          } catch (parseError) {
            console.error("Error parsing validation error:", parseError);
          }
        }

        const errorMessage =
          error instanceof Error ? error.message : "Đăng ký thất bại";
        setErrors({ general: errorMessage });
        showNotification(errorMessage, "error", "Lỗi", 3000);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, showNotification]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    register,
    clearErrors,
    isLoading,
    errors,
  };
};

export const useClassList = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await StudentApiService.getClassList();
      if (response.success) {
        setClasses(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Lấy danh sách trường duy nhất
  const getUniqueSchools = useCallback(() => {
    const schools = classes.map((cls) => cls.school.name);
    return [...new Set(schools)].sort();
  }, [classes]);

  // Lấy danh sách lớp theo trường
  const getClassesBySchool = useCallback(
    (schoolName: string) => {
      return classes
        .filter((cls) => cls.school.name === schoolName && cls.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    [classes]
  );

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    getUniqueSchools,
    getClassesBySchool,
  };
};
