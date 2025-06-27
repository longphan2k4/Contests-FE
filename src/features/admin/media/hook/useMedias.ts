import { useQuery } from "@tanstack/react-query";
import { getAllMedias } from "../service/api";
import { type MediaQuery } from "../types/media.shame";

export const useMedias = (slug: string, filter: MediaQuery) => {
  return useQuery({
    queryKey: ["media", slug,filter],
    queryFn: () => getAllMedias(slug,filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
