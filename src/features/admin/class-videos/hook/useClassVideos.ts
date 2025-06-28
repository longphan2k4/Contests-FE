import { useQuery } from "@tanstack/react-query";
import { getAllClassVideos } from "../service/api";
import { type ClassVideoQuery } from "../types/class-video.shame";

export const useClassVideos = (slug: string,filter: ClassVideoQuery) => {
  return useQuery({
    queryKey: ["class-video",slug, filter],
    queryFn: () => getAllClassVideos(slug,filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};

