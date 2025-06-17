import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
//import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type Award } from "../types/award.shame";

interface AwardListProps {
  awards: Award[];
  selectedAwardIds: number[];
  setSelectedAwardIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function AwardList({
  selectedAwardIds,
  setSelectedAwardIds,
  awards,
  onView,
  onEdit,
  onDelete,
}: AwardListProps): React.ReactElement {
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
    { field: "name", headerName: "Tên Giải", flex: 1 },
    // {
    //   field: "isActive",
    //   headerName: "Trạng thái",
    //   flex: 1,
    //   renderCell: params => (
    //     <IsSwitch
    //       value={params.row.isActive}
    //       onChange={() => onToggle(params.row.id)}
    //     />
    //   ),
    // },
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
        rows={awards}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedAwardIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedAwardIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
