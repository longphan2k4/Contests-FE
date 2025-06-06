import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/api";
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: false, // Không tự động fetch khi mount, chỉ fetch khi gọi refetch()
  });
};
