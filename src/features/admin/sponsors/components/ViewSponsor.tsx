import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { type Sponsor } from "../types/sponsors.shame";
import { Box } from "@mui/material";

import { useSponsorById } from "../hook/useSponsorById";

interface ViewSponsorProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewSponsor({
  id,
  isOpen,
  onClose,
}: ViewSponsorProps): React.ReactElement {
  const { data: user } = useSponsorById(id);
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
