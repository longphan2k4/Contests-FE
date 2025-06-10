import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "../service/api";
import { type Student } from "../types/student.shame";
export const useStudentById = (id: number | null) => {
  return useQuery<Student, Error>({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id!),
    enabled: id !== null,
    retry: false,
  });
};
