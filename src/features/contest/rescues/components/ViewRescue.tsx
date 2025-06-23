import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";

import { useGetById } from "../hook/useRescue";


interface ViewClassProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewRescue({
  id,
  isOpen,
  onClose,
}: ViewClassProps): React.ReactElement {
  const { data: rescue } = useGetById(id);
  const fields = [
    { label: "ID", value: rescue?.id },
    { label: "Tên cứu trợ", value: rescue?.name },
    { label: "Loại cứu trợ", value: rescue?.rescueType },
    { label: "Câu bắt đầu", value: rescue?.questionFrom },
    { label: "Câu bắt đầu", value: rescue?.questionFrom },
    { label: "Câu kết thúc", value: rescue?.questionTo },
    { label: "Số thí sinh còn lại", value: rescue?.remainingContestants },
    { label: "Trạng thái", value: rescue?.status },
    { label: "Id các thí sinh được cứu", value: rescue?.studentIds },
    { label: "Đáp án cứu trợ", value: rescue?.supportAnswers },
    { label: "Cứu trợ ở câu", value: rescue?.questionOrder },
    { label: "Trận đấu", value: rescue?.match.name },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Cập nhật ${rescue?.name}`}
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
