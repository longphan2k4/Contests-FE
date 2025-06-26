import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useGetById } from "../hook/useRound";
import React from "react";

interface ViewClassProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewClass({
  id,
  isOpen,
  onClose,
}: ViewClassProps): React.ReactElement {
  const { data: round, isLoading, isError, refetch } = useGetById(id);
  // Refetch data when the dialog is opened
  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <div>Không thể tải dữ liệu</div>;
  const fields = [
    { label: "ID", value: round?.id },
    { label: "Tên vòng", value: round?.name },
    { label: "Thứ tự", value: round?.index },
    { label: "Ngày bắt đầu ", value: round?.startTime },
    { label: "Ngày kết thúc ", value: round?.endTime },
    {
      label: "Trạng thái",
      value: round?.isActive ? "Đang hoạt động" : "Đã bị vô hiệu hóa",
    },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Xem vòng: ${round?.name}`}
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
