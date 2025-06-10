import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateStudentInput } from "../types/student.shame";
import { CreateStudent } from "../service/api";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentInput) => CreateStudent(payload),
    onSuccess: () => {
      // Giả sử query key bạn dùng là "students"
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
