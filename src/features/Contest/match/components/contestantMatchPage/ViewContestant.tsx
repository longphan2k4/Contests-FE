import AppFormDialog from "../../../../../components/AppFormDialog";
import { Box } from "@mui/material";

import { useGetById } from "../../hook/contestantMatchPage/useContestant";

interface ViewcontestantProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewContestant({
  id,
  isOpen,
  onClose,
}: ViewcontestantProps): React.ReactElement {
  const { data: contestant } = useGetById(id);
  const fields = [
    { label: "ID", value: contestant?.id },
    { label: "Họ và tên", value: contestant?.student.fullName },
    { label: "Tên Trận đấu", value: contestant?.name },
    { label: "Vòng đấu", value: contestant?.round.name },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${contestant?.name}`}
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
