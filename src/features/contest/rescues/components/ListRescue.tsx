import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type Rescues } from "../types/rescue.shame";

interface ListrescueProps {
  rescues: Rescues[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle?: (id: number) => void;
}

export default function ListRescue({
  selectedIds,
  setSelectedIds,
  rescues,
  onView,
  onEdit,
  onDelete,
}: ListrescueProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: params =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "name", headerName: "Tên cứu trợ", flex: 1 },
    { field: "rescueType", headerName: "Loại cứu trợ", flex: 1 },
    { field: "matchName", headerName: "Tên trận đấu", flex: 1 },
    { field: "status", headerName: "Trạng thái", flex: 1 },

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
        rows={rescues}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
