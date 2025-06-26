import React from "react";
import { Box, IconButton, Chip } from "@mui/material";
import DataGrid from "../../../../../components/DataGrid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type Contestant } from "../../../contestant/types/contestant.shame";

interface ListcontestantProps {
  contestants: Contestant[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle?: (id: number) => void;
  
  // New props for disabled rows
  assignedContestantIds?: number[];
}

export default function Listcontestant({
  selectedIds,
  setSelectedIds,
  contestants,
  onView,
  onEdit,
  onDelete,
  assignedContestantIds = [],
}: ListcontestantProps): React.ReactElement {
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
    { field: "fullName", headerName: "Họ và tên", flex: 1.5 },
    { field: "studentCode", headerName: "Mã SV", flex: 1 },
    // { field: "schoolName", headerName: "Trường", flex: 1.5 },
    // { field: "className", headerName: "Lớp", flex: 1 },
    { field: "roundName", headerName: "Vòng đấu", flex: 1 },
    {
      field: "groupName",
      headerName: "Nhóm",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Contestant, string>) => {
        const groupName = params.row.groupName;
        if (!groupName) {
          return <Chip label="Chưa phân nhóm" size="small" color="default" />;
        }
        return <Chip label={groupName} size="small" color="primary" />;
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Contestant, string>) => {
        const status = params.row.status.trim();

        if (status === "compete") return <Chip label="Thi đấu" size="small" color="success" />;
        if (status === "eliminate") return <Chip label="Bị loại" size="small" color="error" />;
        return <Chip label="Qua vòng" size="small" color="info" />;
      },
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
  ];  return (
    <Box sx={{ 
      overflow: "auto",
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px'
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: '4px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#c1c1c1',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: '#a8a8a8'
        }
      }
    }}>      <DataGrid
        rows={contestants}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedIds}
        disabledRowIds={assignedContestantIds}
        getRowClassName={(params) => 
          assignedContestantIds.includes(params.row.id) ? 'disabled-row' : ''
        }
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as unknown as { ids: number[] }).ids || []);
          setSelectedIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
