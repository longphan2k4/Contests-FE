import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../service/api";
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export default { useUsers };
