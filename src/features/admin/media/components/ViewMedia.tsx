import React, { useEffect } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box, CircularProgress } from "@mui/material";
import { useMediaById } from "../hook/useMediaById";

interface ViewMediaProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewMedia({
  id,
  isOpen,
  onClose,
}: ViewMediaProps): React.ReactElement {
  const { data: media, isLoading, isError, refetch } = useMediaById(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  const fields: { label: string; value: React.ReactNode }[] = [
    { label: "ID", value: media?.id },
    {
      label: "Ảnh",
      value: media?.url ? (
        <img
          src={media.url}
          alt="Preview"
          style={{
            maxWidth: "100%",
            maxHeight: 200,
            borderRadius: 8,
            objectFit: "contain",
          }}
        />
      ) : (
        "Không có ảnh"
      ),
    },
    { label: "Loại media", value: media?.type },
    { label: "Ngày tạo", value: media?.createdAt },
    { label: "Cập nhật gần nhất", value: media?.updatedAt },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <div>Không thể tải dữ liệu</div>;

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết media`}
        maxWidth="sm"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {fields.map(
              ({ label, value }) =>
                value !== undefined && (
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
                      {value}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
