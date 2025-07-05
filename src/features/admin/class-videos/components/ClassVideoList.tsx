import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type ClassVideo } from "../types/class-video.shame";

interface ClassVideoListProps {
  classVideos: ClassVideo[];
  selectedClassVideoIds: number[];
  setSelectedClassVideoIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ClassVideoList({
  selectedClassVideoIds,
  setSelectedClassVideoIds,
  classVideos,
  onView,
  onEdit,
  onDelete,
}: ClassVideoListProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
      sortable: false,
    },
    { field: "name", headerName: "Tên video", flex: 1 },
    { field: "slogan", headerName: "slogan", flex: 1 },
    { field: "className", headerName: "Lớp", flex: 1 },

    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      minWidth: 200,

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
        rows={classVideos}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedClassVideoIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedClassVideoIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
