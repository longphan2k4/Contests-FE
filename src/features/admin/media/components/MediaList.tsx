import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
//import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type MediaItem } from "../types/media.shame";

interface MediaListProps {
  media: MediaItem[];
  selectedMediaIds: number[];
  setSelectedMediaIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function MediaList({
  selectedMediaIds,
  setSelectedMediaIds,
  media,
  onView,
  onEdit,
  onDelete,
}: MediaListProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
    },
    { field: "url", headerName: "Url", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: params =>
        params.row.type === "images"
          ? "Hình ảnh"
          : params.row.type === "logo"
          ? "Logo"
          : "Ảnh nền",
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: params => (
        <>
          <IconButton color="primary" onClick={() => onView(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => onEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <Box>
      <DataGrid
        rows={media}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedMediaIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedMediaIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
