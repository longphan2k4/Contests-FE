import { useQuery } from "@tanstack/react-query";
import { ListMatch } from "../service/api";

export const useListMatch = (slug: string | null) => {
  return useQuery({
    queryKey: ["list-match", slug],
    queryFn: () => ListMatch(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
