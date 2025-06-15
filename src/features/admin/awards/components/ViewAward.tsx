import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";

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
  const { data: award } = useAwardById(id);

  const fields = [
    { label: "ID", value: award?.id },
    { label: "Tên giải thưởng", value: award?.name },
    { label: "ID Cuộc thi", value: award?.contest_id },
    { label: "ID Thí sinh", value: award?.contestant_id },
    { label: "Loại giải", value: award?.type },
    { label: "Ngày tạo", value: award?.createdAt },
    { label: "Cập nhật gần nhất", value: award?.updatedAt },
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết giải thưởng "${award?.name}"`}
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
