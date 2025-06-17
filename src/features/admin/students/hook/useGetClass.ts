import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "../service/api";
import { type StudentQuery } from "../types/student.shame";

export const useClasses = (filter: StudentQuery) => {
  return useQuery({
    queryKey: ["class", filter],
    queryFn: () => getAllClasses(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
