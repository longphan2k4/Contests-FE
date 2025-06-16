import { useQuery } from "@tanstack/react-query";
import { getAllSponsors } from "../service/api";
import { type SponsorQuery } from "../types/sponsors.shame";

export const useSponsors = (slug: string, filter: SponsorQuery) => {
  return useQuery({
    queryKey: ["sponsors", slug, filter],
    queryFn: () => getAllSponsors(slug, filter),
    placeholderData: prev => prev,
  });
};