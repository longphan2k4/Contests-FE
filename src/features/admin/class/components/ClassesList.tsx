import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type Classes } from "../types/class.shame";

interface ClassListProps {
  Classes: Classes[];
  selectedClassIds: number[];
  setSelectedClassIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function ClassList({
  selectedClassIds,
  setSelectedClassIds,
  Classes,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: ClassListProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
    },
    { field: "name", headerName: "Tên lớp", flex: 1 },
    { field: "shoolName", headerName: "Tên trường", flex: 1 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 1,

      renderCell: params => (
        <IsSwitch
          value={params.row.isActive}
          onChange={() => onToggle(params.row.id)}
        />
      ),
    },
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
        rows={Classes}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedClassIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedClassIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
