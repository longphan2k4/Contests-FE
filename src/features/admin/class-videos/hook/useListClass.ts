import { useQuery } from "@tanstack/react-query";
import { listClass } from "../service/api";

export const useListClass = () => {
  return useQuery({
    queryKey: ["class-video"],
    queryFn: () => listClass(),
  });
};
