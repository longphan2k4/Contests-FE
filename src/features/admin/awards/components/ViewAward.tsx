import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useAwardById } from "../hook/useAwardById";

interface ViewAwardProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewAward({
  id,
  isOpen,
  onClose,
}: ViewAwardProps): React.ReactElement {
  const { data: award, refetch, isError, isLoading } = useAwardById(id);

  useEffect(() => {
    if (isOpen && id) {
      refetch();
    }
  }, [isOpen, id]);

  const fields = [
    { label: "ID", value: award?.id },
    { label: "Tên giải thưởng", value: award?.name },
    {
      label: "Thí sinh",
      value: award?.contestant?.student?.fullName ?? "Không có",
    },
    {
      label: "Loại giải",
      value:
        award?.type === "firstPrize"
          ? "Giải Nhất"
          : award?.type === "secondPrize"
          ? "Giải Nhì"
          : "Giải Ba",
    },
    { label: "Trận đấu", value: award?.match?.name ?? "Không có" },
    { label: "Ngày tạo", value: award?.createdAt },
    { label: "Cập nhật gần nhất", value: award?.updatedAt },
  ];
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <div>Không thể tải dữ liệu</div>;
  }

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết giải thưởng ${award?.name}`}
        maxWidth="sm"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {fields.map(
              ({ label, value }) =>
                value !== undefined && (
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
                )
            )}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
