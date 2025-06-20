import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";

import { useGetById } from "../hook/useGroup";

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
  const { data: group } = useGetById(id);
  const fields = [
    { label: "ID", value: group?.id },
    { label: "Tên nhóm", value: group?.name },
    { label: "Trận đấu", value: group?.match.name },
    { label: "Trọng tài", value: group?.user.username },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${group?.name}`}
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
