import { useMutation } from "@tanstack/react-query";

import { deletes } from "../../services/schoolService";

export const useDeleteSchool = () => {
  const mutation = useMutation({
    mutationFn: (id: number) => deletes(id),
  });

  return mutation;
};
