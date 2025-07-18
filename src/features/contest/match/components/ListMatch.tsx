import React from "react";
import { useParams, Link } from "react-router-dom";

import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForumIcon from "@mui/icons-material/Forum";
// them icon de tuowng tac voi danh sach thi sinh
import GroupsIcon from "@mui/icons-material/Groups";

import { type Match } from "../types/match.shame";
import IsSwitch from "../../../../components/IsSwitch";

interface ListMatchProps {
  matchs: Match[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle?: (id: number) => void;
}

export default function ListMatch({
  selectedIds,
  setSelectedIds,
  matchs,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: ListMatchProps): React.ReactElement {
  const { slug } = useParams();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
    },
    { field: "name", headerName: "Trận đấu", flex: 1 },
    { field: "roundName", headerName: "Vòng đấu", flex: 1 },
    { field: "questionPackageName", headerName: "Gói câu hỏi", flex: 1 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: params => (
        <IsSwitch
          value={params.row.isActive}
          onChange={() => onToggle?.(params.row.id)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      minWidth: 250,
      flex: 1,
      renderCell: params => (
        <>
          <IconButton color="primary" onClick={() => onView(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => onEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <Link
            to={`/admin/contest/${slug}/contestant-match/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <IconButton color="info" title="Danh sách thí sinh">
              <GroupsIcon />
            </IconButton>
          </Link>

          <Link to={`/admin/contest/${slug}/control/${params.row.slug}`}>
            <ForumIcon />
          </Link>
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
        rows={matchs}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as Set<number>).values() || []);
          setSelectedIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
