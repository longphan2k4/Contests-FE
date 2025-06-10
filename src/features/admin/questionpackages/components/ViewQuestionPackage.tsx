import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";
import { type QuestionPackage } from "../types/questionpackages.shame";

interface ViewQuestionPackageProps {
  questionPackage: QuestionPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewQuestionPackages({
  questionPackage,
  isOpen,
  onClose,
}: ViewQuestionPackageProps): React.ReactElement {
  const fields = [
    { label: "ID", value: questionPackage?.id },
    { label: "Tên gói câu hỏi", value: questionPackage?.name },
    { label: "Số câu hỏi", value: questionPackage?.questionDetailsCount },
    { label: "Số kỳ thi sử dụng", value: questionPackage?.matchesCount },
    { label: "Ngày tạo", value: questionPackage?.createdAt },
    { label: "Ngày cập nhật", value: questionPackage?.updatedAt },
    {
      label: "Trạng thái",
      value: questionPackage?.isActive ? "Đang hoạt động" : "Vô hiệu hóa",
    },
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết gói: ${questionPackage?.name ?? ""}`}
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
                  {String(value ?? "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
