import React from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import IsSwitch from "../../../../components/IsSwitch";
import type { QuestionPackage } from "../types/questionpackages.shame";

export interface Filter {
  page: number;
  limit: number;
  keyword: string;
  searchText: string;
}

interface QuestionPackagesListProps {
  questionPackages: QuestionPackage[];
  totalItems: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onViewQuestions: (id: number) => void;
}

export default function QuestionPackagesList({
  questionPackages,
  filter,
  onView,
  onEdit,
  onDelete,
  onToggle,
  onViewQuestions,
}: QuestionPackagesListProps): React.ReactElement {

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        (filter.page - 1) * filter.limit + params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "name", headerName: "Tên gói câu hỏi", flex: 1 },
    { field: "questionDetailsCount", headerName: "Số câu hỏi", flex: 1 },
    { field: "matchesCount", headerName: "Số kỳ thi", flex: 1 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) => (
        <IsSwitch value={params.row.isActive} onChange={() => onToggle(params.row.id)} />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => onView(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => onViewQuestions(params.row.id)}>
            <QuestionAnswerIcon />
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
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={questionPackages}
        columns={columns}
        getRowId={(row: QuestionPackage) => row.id}
        hideFooterPagination
      />
    </Box>
  );
}
