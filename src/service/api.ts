import axiosInstance from "@config/axiosInstance";

const api = {
  exportExcel: async ({
    data,
    fileName,
  }: {
    data: any[];
    fileName: string;
  }) => {
    const response = await axiosInstance.post(
      "/excel/export",
      { data, fileName },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "export.xlsx");
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
