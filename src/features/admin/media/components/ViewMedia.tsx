import React, { useEffect, useState } from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";
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
  const { data: media } = useMediaById(id);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
  if (!media?.url) {
    setPreviewUrl(null);
    return;
  }

  if (typeof media.url === "string") {
    setPreviewUrl(media.url);
    return; // ✅ Thêm dòng này
  }

  if (media.url instanceof File) {
    const objectUrl = URL.createObjectURL(media.url);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

  return; // ✅ fallback return
}, [media?.url]);



  const fields: { label: string; value: React.ReactNode }[] = [
    { label: "ID", value: media?.id },
    {
      label: "Ảnh",
      value: previewUrl ? (
        <img
          src={previewUrl}
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

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết media ID ${media?.id}`}
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
