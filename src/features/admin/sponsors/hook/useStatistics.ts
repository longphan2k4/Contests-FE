import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "../service/api";

export const useStatistics = () => {
  return useQuery({
    queryKey: ["sponsors"],
    queryFn: () => getStatistics(),
    placeholderData: prev => prev,
  });
};