import React from "react";
import AppFormDialog from "../../../../components/AppFormDialog";
import { Box } from "@mui/material";
import { useSponsorById } from "../hook/useSponsorById";
import { getMediaUrl } from '@/config/env';

interface ViewSponsorProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewSponsor({
  id,
  isOpen,
  onClose,
}: ViewSponsorProps): React.ReactElement {
  const { data: sponsor } = useSponsorById(id);

  const fields = [
    { label: "ID", value: sponsor?.id },
    { label: "Tên nhà tài trợ", value: sponsor?.name },    {
  label: "Logo",
  value: sponsor?.logo ? (
    <img
      src={getMediaUrl(sponsor.logo)}
      alt="logo"
      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
    />
  ) : (
    "Không có logo"
  ),
},
{
  label: "Ảnh giới thiệu",
  value: sponsor?.images ? (
    <img
      src={getMediaUrl(sponsor.images)}
      alt="image"
      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
    />
  ) : (
    "Không có ảnh"
  ),
},    {
      label: "Video",
      value: sponsor?.videos ? (
        <video
          src={getMediaUrl(sponsor.videos)}
          controls
          style={{ width: 200, height: 150, borderRadius: 8 }}
        />
      ) : (
        "Không có video"
      ),
    },
    
    { label: "Cuộc thi liên kết", value: sponsor?.contestId ?? "Chưa gán" },
  ];

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Chi tiết ${sponsor?.name}`}
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
                  {typeof value === "string" || typeof value === "number"
                    ? value
                    : value || "Không có dữ liệu"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AppFormDialog>
    </Box>
  );
}
