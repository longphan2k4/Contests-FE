import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../service/api";
import { type Filter } from "../components/StudentList";
export const useStudents = (filter: Filter) => {
  return useQuery({
    queryKey: ["student", filter.page, filter.limit, filter.keyword || ""],
    queryFn: ()=>
      getAllStudents({
         page: filter.page,
        limit: filter.limit,
        search: filter.keyword || "",
      }),
      placeholderData: prevData => prevData,
  });
};

export default { useStudents };
