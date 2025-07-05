import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type User } from "../types/user.shame";

interface UserListProps {
  users: User[];
  selectedUserIds: number[];
  setSelectedUserIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function UserList({
  selectedUserIds,
  setSelectedUserIds,
  users,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: UserListProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
    },
    { field: "username", headerName: "Tên tài khoản", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 1,
      renderCell: params => {
        return (
          <>
            {params.row.role === "Admin"
              ? "Quản trị viên"
              : params.row.role === "Judge"
              ? "Trọng tài"
              : "Sinh viên"}
          </>
        );
      },
    },
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
        rows={users}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedUserIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedUserIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
