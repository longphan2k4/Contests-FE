import { useMutation } from "@tanstack/react-query";
import { DeleteUser } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteUser(id),
  });
};
