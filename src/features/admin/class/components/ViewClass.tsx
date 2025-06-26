import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useClassById } from "../hook/useClassById";
import { useEffect } from "react";

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
  const { data: Class, isLoading, isError, refetch } = useClassById(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const fields = [
    { label: "ID", value: Class?.id },
    { label: "Tên lớp", value: Class?.name },
    { label: "Tên trường", value: Class?.school.name },
    {
      label: "Trạng thái",
      value: Class?.isActive ? "Đang hoạt động" : "Đã bị vô hiệu hóa",
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
        title={`Xem lớp: ${Class?.name}`}
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
