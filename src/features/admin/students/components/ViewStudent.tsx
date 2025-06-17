import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";
import { useStudentById } from "../hook/useStudentById";
import { useClasses } from "../hook/useGetClass";
import { type ClassItem } from "../types/student.shame";
interface ViewStudentProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewStudent({
  id,
  isOpen,
  onClose,
}: ViewStudentProps): React.ReactElement {
  const { data: student } = useStudentById(id);
  const { data: classData } = useClasses({});
  const classOptions = (classData?.data?.classes || []) as ClassItem[];
  const classLabel = classOptions.find(cls => cls.id === student?.classId);
  const fields = [
    { label: "ID", value: student?.id },
    { label: "Họ và tên", value: student?.fullName },
    { label: "Mã học sinh", value: student?.studentCode },
    {
    label: "Lớp",
    value: classLabel
      ? `${classLabel.name} - ${classLabel.shoolName}`
      : "-",
    },
    {
      label: "Trạng thái",
      value: student?.isActive ? "Đang hoạt động" : "Không hoạt động",
    },
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Thông tin chi tiết: ${student?.fullName || "Học sinh"}`}
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
                  {value !== undefined && value !== null ? String(value) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
