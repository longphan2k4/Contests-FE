import { useQuery } from "@tanstack/react-query";
import { getAllRescues } from "../service/api";
import { type RescueQuery } from "../types/rescues.shame";

export const useRescue = (filter: RescueQuery) => {
  return useQuery({
    queryKey: ["rescue", filter],
    queryFn: () => getAllRescues(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
