import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useGetById } from "../hook/useMatch";
import { useEffect } from "react";

interface ViewMatchProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewMatch({
  id,
  isOpen,
  onClose,
}: ViewMatchProps): React.ReactElement {
  const { data: match, isLoading, isError, refetch } = useGetById(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);
  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (isError) return <div>Không thể tải dữ liệu</div>;

  const fields = [
    { label: "ID", value: match?.id },
    { label: "Đường dẫn", value: match?.slug },
    { label: "Tên Trận đấu", value: match?.name },
    // { label: "Thí sinh Gold", value: match?.student.fullName ?? "Không có" },
    { label: "Vòng đấu", value: match?.round.name },
    { label: "Gói câu hỏi", value: match?.questionPackage.name },
    { label: "Câu hỏi hiện tại", value: match?.currentQuestion },
    { label: "Thời gian còn lại của câu hỏi", value: match?.remainingTime },
    { label: "Thời gian bắt đầu", value: match?.startTime },
    { label: "Thời gian kết thúc", value: match?.endTime },
    {
      label: "Trạng thái",
      value:
        match?.status === "upcoming"
          ? "Sắp diễn ra"
          : match?.status === "ongoing"
          ? "Đang diễn ra"
          : "Đã kết thúc",
    },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Xem trận đấu: ${match?.name}`}
        maxWidth="md"
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
