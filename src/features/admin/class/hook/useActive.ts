import { useMutation } from "@tanstack/react-query";
import { ToggleActive } from "../service/api";

export const useActive = () => {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => ToggleActive(id),
  });
};
