import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../service/api";
import { type UserQuery } from "../types/user.shame";

export const useUsers = (filter: UserQuery) => {
  return useQuery({
    queryKey: ["users", filter],
    queryFn: () => getAllUsers(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
