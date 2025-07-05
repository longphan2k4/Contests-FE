import { useQuery } from "@tanstack/react-query";
import { ListStudents } from "../service/api";

export const useListUserStudent = () => {
  return useQuery({
    queryKey: ["listUserStudent"],
    queryFn: () => ListStudents(),
  });
};
