import React, { useEffect } from "react";
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
  const { data: video, isLoading, isError, refetch } = useClassVideoById(id);
  useEffect(() => {
    if (isOpen && id) {
      refetch();
    }
  }, [isOpen, id, refetch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) return <div>Không thể tải dữ liệu</div>;

  const fields = [
    { label: "ID", value: video?.id },
    { label: "Tên Video", value: video?.name },
    { label: "Slogan", value: video?.slogan },
    { label: "Lớp", value: video?.class?.name || "Không có lớp" },
    {
      label: "Video",
      value: video?.videos ? (
        <video
          controls
          style={{
            marginTop: "8px",
            borderRadius: "8px",
            width: "100%",
            height: "150px",
            objectFit: "cover", // 👈 cái này giúp video bo hết khung
          }}
        >
          <source src={video?.videos} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
      ) : (
        "Không có video"
      ),
    },
  ];

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title={`Xem Video Lớp: ${video?.name}`}
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
