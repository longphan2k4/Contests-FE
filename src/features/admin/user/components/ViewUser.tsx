import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useUserById } from "../hook/userUserById";

interface ViewUserProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewUser({
  id,
  isOpen,
  onClose,
}: ViewUserProps): React.ReactElement {
  const { data: user, isLoading, isError } = useUserById(id);
  const fields = [
    { label: "ID", value: user?.id },
    { label: "Tên tài khoản", value: user?.username },
    { label: "Email", value: user?.email },
    { label: "Vai trò", value: user?.role },
    {
      label: "Trạng thái",
      value: user?.isActive ? "Đang hoạt động" : "Đã bị vô hiệu hóa",
    },
  ];

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <div>Không thể load dữ liệu</div>;
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${user?.username}`}
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
