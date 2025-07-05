import { useQuery } from "@tanstack/react-query";
import { ListContestant } from "../service/api";

export const useListContestants = (slug: string | null) => {
  return useQuery({
    queryKey: ["listContestants", slug],
    queryFn: () => ListContestant(slug),
    enabled: !!slug,
  });
};
