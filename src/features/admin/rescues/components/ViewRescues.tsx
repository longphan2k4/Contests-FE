import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
//import { type Rescue } from "../types/rescues.shame";
import { Box } from "@mui/material";

import { useRescueById } from "../hook/useRescueById";

interface ViewRescueProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewRescue({
  id,
  isOpen,
  onClose,
}: ViewRescueProps): React.ReactElement {
  const { data: rescue } = useRescueById(id);

  const fields = [
    { label: "ID", value: rescue?.id },
    { label: "Tên cuộc giải cứu", value: rescue?.name },
    { label: "Loại cứu hộ", value: rescue?.rescueType },
    { label: "Chủ đề câu hỏi từ", value: rescue?.questionFrom },
    { label: "Chủ đề câu hỏi đến", value: rescue?.questionTo },
    { label: "Số lượng học sinh", value: rescue?.studentIds?.length },
    { label: "Hỗ trợ câu trả lời", value: rescue?.supportAnswers?.join(", ") },
    { label: "Số còn lại", value: rescue?.remainingContestants },
    { label: "Số tối đa", value: rescue?.maxStudent },
    { label: "Thứ tự", value: rescue?.index },
    { label: "Trạng thái", value: rescue?.status },
    { label: "Mã trận đấu", value: rescue?.matchId },
    // Thêm các trường khác nếu cần thiết
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Thông tin cuộc giải cứu: ${rescue?.name}`}
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
                  {value !== undefined && value !== null ? String(value) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}