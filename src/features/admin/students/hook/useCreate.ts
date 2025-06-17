import { useMutation } from "@tanstack/react-query";
import { type CreateStudentInput } from "../types/student.shame";
import { CreateStudent } from "../service/api";

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: (payload: CreateStudentInput) => CreateStudent(payload),
  });
};
