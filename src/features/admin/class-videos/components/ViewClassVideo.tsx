import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";
import { useClassVideoById } from "../hook/useClassVideoById";

interface ViewClassVideoProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewClassVideo({
  id,
  isOpen,
  onClose,
}: ViewClassVideoProps): React.ReactElement {
  const { data: video, isLoading, isError } = useClassVideoById(id);

  const fields = [
    { label: "ID", value: video?.id },
    { label: "Tên Video", value: video?.name },
    { label: "Slogan", value: video?.slogan },
    { label: "Lớp", value: video?.classId },
    {
      label: "Video",
      value: video?.videos ? (
        <video
          width="100%"
          height="auto"
          controls
          src={video.videos}
          style={{ maxWidth: 400, marginTop: 8 }}
        />
      ) : (
        "Không có video"
      ),
    },
    { label: "Ngày tạo", value: new Date(video?.createdAt || "").toLocaleString() },
    { label: "Ngày cập nhật", value: new Date(video?.updatedAt || "").toLocaleString() },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !video) return <div></div>;

  return (
    <AppFormDialog open={isOpen} onClose={onClose} title={`Xem Video Lớp: ${video.name}`} maxWidth="sm">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {fields.map(({ label, value }) => (
            <tr key={label} style={{ borderBottom: "1px solid #ddd" }}>
              <td
                style={{
                  fontWeight: "bold",
                  padding: "8px",
                  width: "35%",
                  verticalAlign: "top",
                }}
              >
                {label}
              </td>
              <td style={{ padding: "8px", verticalAlign: "top" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppFormDialog>
  );
}
