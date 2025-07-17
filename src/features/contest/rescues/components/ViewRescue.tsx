import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";

import { useGetById } from "../hook/useRescue";
import { useEffect } from "react";

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
  const { data: rescue, isLoading, isError, refetch } = useGetById(id);

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
    { label: "ID", value: rescue?.id },
    { label: "Tên cứu trợ", value: rescue?.name },
    {
      label: "Loại cứu trợ",
      value:
        rescue?.rescueType === "resurrected" ? "Hồi sinh" : "Phao cứu sinh",
    },
    { label: "Câu bắt đầu", value: rescue?.questionFrom },
    { label: "Câu kết thúc", value: rescue?.questionTo },
    { label: "Số thí sinh còn lại", value: rescue?.remainingContestants },
    {
      label: "Trạng thái",
      value:
        rescue?.status === "notUsed"
          ? "Chưa sử dụng"
          : rescue?.status === "used"
          ? "Đã sử dụng"
          : "Đã qua",
    },
    {
      label: "Id các thí sinh được cứu",
      value: rescue?.studentIds.length > 0 ? rescue?.studentIds : "Không có",
    },
    {
      label: "Đáp án cứu trợ",
      value:
        rescue?.supportAnswers?.length > 0
          ? rescue?.supportAnswers
          : "Không có",
    },
    { label: "Cứu trợ ở câu", value: rescue?.questionOrder },
    { label: "Trận đấu", value: rescue?.match.name },
  ];
  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Xem cứu trợ : ${rescue?.name}`}
        maxWidth="lg"     >
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
