import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useQuestionPackageById } from "../hook/useQuestionPackageById";

interface ViewQuestionPackageProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewQuestionPackage({
  id,
  isOpen,
  onClose,
}: ViewQuestionPackageProps): React.ReactElement {
  const {
    data: questionPackage,
    isLoading,
    isError,
    refetch,
  } = useQuestionPackageById(id);

  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);
  const fields = [
    { label: "ID", value: questionPackage?.id },
    { label: "Tên gói câu hỏi", value: questionPackage?.name },
    { label: "Số câu hỏi", value: questionPackage?.questionDetailsCount },
    { label: "Số trận sử dụng", value: questionPackage?.matchesCount },
    {
      label: "Ngày tạo",
      value: questionPackage?.createdAt
        ? new Date(questionPackage.createdAt).toLocaleString()
        : "",
    },
    {
      label: "Ngày cập nhật",
      value: questionPackage?.updatedAt
        ? new Date(questionPackage.updatedAt).toLocaleString()
        : "",
    },
    {
      label: "Trạng thái",
      value: questionPackage?.isActive ? "Đang hoạt động" : "Đã vô hiệu hoá",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <div>Không thể load dữ liệu</div>;
  }
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${questionPackage?.name}`}
        maxWidth="sm"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {fields.map(({ label, value }) => (
              <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    width: "40%",
                    verticalAlign: "top",
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: "8px", verticalAlign: "top" }}>
                  {String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
