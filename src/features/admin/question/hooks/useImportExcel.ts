import { useMutation } from "@tanstack/react-query";
import { ImportExcel } from "../services/questionService";

export const useImportExcel = () => {
  return useMutation({
    mutationFn: (file: File) => {
      return ImportExcel(file);
    },
  });
};