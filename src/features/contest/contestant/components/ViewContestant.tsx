import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useGetById } from "../hook/useContestant";

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
  const { data: contestant, isLoading, isError } = useGetById(id);
  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <div>Không thể tải dữ liệu</div>;
  const fields = [
    { label: "ID", value: contestant?.id },
    { label: "Họ và tên", value: contestant?.student.fullName },
    { label: "Vòng đấu", value: contestant?.round.name },
    {
      label: "Trạng thái",
      value:
        contestant?.status === "compete"
          ? "Thi đấu"
          : contestant?.status === "eliminate"
          ? "Bị loại"
          : "Qua vòng",
    },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${contestant?.student.fullName}`}
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
