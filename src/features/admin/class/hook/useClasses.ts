import { useQuery } from "@tanstack/react-query";
import { getAllclasss } from "../service/api";
import { type ClassQuery } from "../types/class.shame";

export const useClasses = (filter: ClassQuery) => {
  return useQuery({
    queryKey: ["classs", filter],
    queryFn: () => getAllclasss(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
