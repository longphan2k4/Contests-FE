import { useMutation } from "@tanstack/react-query";
import { type UpdateStudentInput } from "../types/student.shame";
import { UpdateStudent } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStudentInput }) =>
      UpdateStudent(id, payload),
  });
};
