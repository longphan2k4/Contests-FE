import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../service/api";
import { type StudentQuery } from "../types/student.shame";

export const useStudents = (filter: StudentQuery) => {
  return useQuery({
    queryKey: ["student", filter],
    queryFn: () => getAllStudents(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
