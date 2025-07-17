import React from "react";
import { Box, IconButton } from "@mui/material";
import DataGrid from "../../../../components/DataGrid";
import IsSwitch from "../../../../components/IsSwitch";
import type { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { type QuestionPackage } from "../types/questionpackages.shame";

interface QuestionPackageListProps {
  questionPackages: QuestionPackage[];
  selectedQuestionPackageIds: number[];
  setSelectedQuestionPackageIds: React.Dispatch<React.SetStateAction<number[]>>;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onViewQuestions: (id: number) => void;
}

export default function QuestionPackageList({
  selectedQuestionPackageIds,
  setSelectedQuestionPackageIds,
  questionPackages,
  onView,
  onEdit,
  onDelete,
  onToggle,
  onViewQuestions,
}: QuestionPackageListProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
    },
    { field: "name", headerName: "Tên gói câu hỏi", flex: 1 },
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
      renderCell: params => (
        <>
          <IconButton color="primary" onClick={() => onView(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => onViewQuestions(params.row.id)}
          >
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
    <Box>
      <DataGrid
        rows={questionPackages}
        columns={columns}
        getRowId={row => row.id}
        selectedIds={selectedQuestionPackageIds}
        onSelectChange={selection => {
          const idsArray = Array.isArray(selection)
            ? selection
            : Array.from((selection as any).ids || []);
          setSelectedQuestionPackageIds(idsArray.map(id => Number(id)));
        }}
      />
    </Box>
  );
}
