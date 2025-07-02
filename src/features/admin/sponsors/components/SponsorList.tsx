import React from "react";
import { Box, IconButton, Avatar } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
//import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getMediaUrl } from "@/config/env";

import { type Sponsor } from "../types/sponsors.shame";

interface SponsorListProps {
  sponsors: Sponsor[];
  selectedSponsorIds: number[];
  setSelectedSponsorIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function SponsorList({
  selectedSponsorIds,
  setSelectedSponsorIds,
  sponsors,
  onView,
  onEdit,
  onDelete,
}: SponsorListProps): React.ReactElement {  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: params =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "name", headerName: "Tên", flex: 1 },    {
      field: "logo",
      headerName: "Logo",
      width: 80,
      renderCell: params => (
        params.row.logo ? (
          <Avatar
            src={getMediaUrl(params.row.logo)}
            alt="logo"
            sx={{ width: 40, height: 40 }}
            onError={(e) => {
              console.error('Image load error:', getMediaUrl(params.row.logo));
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}>?</Avatar>
        )
      ),
    },
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
        rows={sponsors}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedSponsorIds}        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as { ids?: number[] }).ids || []);
          setSelectedSponsorIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
