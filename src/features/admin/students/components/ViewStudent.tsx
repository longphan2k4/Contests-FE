import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { type Student } from "../types/student.shame";
import { Box } from "@mui/material";

interface ViewStudentProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewStudent({
  student,
  isOpen,
  onClose,
}: ViewStudentProps): React.ReactElement {
  const fields = [
    { label: "ID", value: student?.id },
    { label: "Họ và tên", value: student?.fullName },
    { label: "Mã học sinh", value: student?.studentCode },
    { label: "Lớp", value: student?.className },
    {
      label: "Trạng thái",
      value: student?.isActive ? "Đang hoạt động" : "Đã bị vô hiệu hóa",
    },
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết học sinh`}
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
