import { useMutation } from "@tanstack/react-query";
import { updateStudent } from "../service/api"; // import API của bạn

type UpdateStudentPayload = {
  id: number;
  data: Partial<{
    fullName: string;
    studentCode: string;
    classId?: number;
    isActive: boolean;
  }>;
};

export const useUpdateStudent = () => {
  const mutation = useMutation<
    any,
    unknown,
    UpdateStudentPayload
  >({
    mutationFn: ({ id, data }) => {
      // Loại bỏ các trường undefined
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      // Gọi API, ép kiểu phù hợp
      return updateStudent(id, cleanedData as {
        fullName: string;
        studentCode: string;
        classId?: number;
        isActive: boolean;
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        console.log(data.message);
      }
    },
    onError: (error) => {
      alert("Có lỗi xảy ra khi cập nhật: " + error);
    },
  });

  return mutation;
};