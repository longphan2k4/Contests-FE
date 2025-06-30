import { useQuery } from "@tanstack/react-query";
import { getSponsorById } from "../service/api";

export const useSponsorById = (id: number | null) => {
  return useQuery({
    queryKey: ["sponsor", id],
    queryFn: () => getSponsorById(id),
    enabled: !!id,
  });
};
