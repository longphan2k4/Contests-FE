import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";

import { useGetById } from "../hook/useRound";

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
  const { data: round } = useGetById(id);
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
        title={`Cập nhật ${round?.name}`}
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
