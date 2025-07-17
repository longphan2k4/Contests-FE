import { useMutation } from "@tanstack/react-query";
import { ImportExcel } from "../service/api";

export const useImportExcel = () => {
  return useMutation({
    mutationFn: (file: File) => {
      return ImportExcel(file);
    },
  });
};
