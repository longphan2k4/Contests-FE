import { useState } from "react";
import type { ApiErrorResponse } from "../../types/school";
import { AxiosError } from "axios";
import { deleteSchool } from "../../services/schoolService";
import { useToast } from "../../../../../contexts/toastContext";

export const useDeleteSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleDeleteSchools = async (ids: number[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await deleteSchool(ids);

      // Hiển thị thông báo tổng hợp
      const successCount = result.messages.filter(
        m => m.status === "success"
      ).length;
      const errorCount = result.messages.filter(
        m => m.status === "error"
      ).length;

      // Hiển thị thông báo tổng hợp
      if (successCount > 0) {
        showToast(`Đã xóa thành công ${successCount} trường học`, "success");
      }
      if (errorCount > 0) {
        showToast(`Không thể xóa ${errorCount} trường học`, "error");
      }

      // Hiển thị từng thông báo chi tiết
      result.messages.forEach(message => {
        if (message.status === "success") {
          showToast(message.msg, "success");
        } else {
          showToast(message.msg, "error");
        }
      });

      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error("Lỗi khi xóa trường học:", error);

      if (error.response?.data) {
        const errorResponse = error.response.data;
        const errorMessage = errorResponse.message || `Lỗi khi xóa trường học`;
        console.error("Chi tiết lỗi từ server:", errorResponse);
        setError(errorMessage);
        showToast(errorMessage, "error");
      } else {
        const errorMessage = error.message || `Lỗi khi xóa trường học`;
        console.error("Lỗi không xác định:", errorMessage);
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteSchools,
    loading,
    error,
    success,
  };
};
