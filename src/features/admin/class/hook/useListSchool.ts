import { useQuery } from "@tanstack/react-query";
import { listSchool } from "../service/api";
export const useListSChool = () => {
  return useQuery({
    queryKey: ["listSchool"],
    queryFn: () => listSchool(),
  });
};
