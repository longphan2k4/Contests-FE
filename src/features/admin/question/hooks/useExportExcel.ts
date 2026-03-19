import { useMutation } from "@tanstack/react-query";
import api from "@/service/api";

type ExportExcelPayload = {
  data: any[];
  fileName: string;
};
export const useExportExcel = () => {
  return useMutation({
    mutationFn: (payload: ExportExcelPayload) => {
      return api.exportExcel(payload);
    },
  });
};
