import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "../service/api";

export const useClasses = () => {
  return useQuery({
    queryKey: ["class"],
    queryFn: () => getAllClasses(),
  });
};
