import { useQuery } from "@tanstack/react-query";
import { getListStudentCurrent } from "../service/api";

export const useListUserStudentCurrent = (id: string | null) => {
  return useQuery({
    queryKey: ["listUserStudent", id],
    queryFn: () => {
      if (!id || id === "null") return [];
      return getListStudentCurrent(id);
    },
    enabled: !!id,
  });
};
