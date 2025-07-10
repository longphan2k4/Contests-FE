import React from "react";
import { Box, IconButton, Chip } from "@mui/material";
// import DataGrid from "../../../../../components/DataGrid";
import DataGrid2 from "../../../../../components/DataGrid/index2";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { type Contestant } from "../../types/contestant-match.types";

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

  removeFromGroup?: (groupIndex: number, contestantId: number) => void;
  activeGroupTab?: number;
  groups?: { [key: number]: Contestant[] };
  page: number;
  limit: number;
}

export default function Listcontestant({
  selectedIds,
  setSelectedIds,
  contestants,
  onView,
  onEdit,
  onDelete,
  assignedContestantIds = [],
  removeFromGroup,
  activeGroupTab,
  groups,
  page,
  limit,
}: ListcontestantProps): React.ReactElement {
  const columns: GridColDef[] = [
    {
      field: "remove",
      headerName: "Vị trí",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: params =>
        removeFromGroup &&
          activeGroupTab !== undefined &&
          groups?.[activeGroupTab]?.some(c => c.id === params.row.id) ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="error"
              size="small"
              title="Xóa khỏi nhóm này"
              disableRipple
              disableFocusRipple
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
              onClick={e => {
                e.stopPropagation();
                removeFromGroup(activeGroupTab, params.row.id);
              }}
            >
              ✕
            </IconButton>
            <Box sx={{ fontWeight: 'bold', fontSize: 20 }}>
              {
                groups?.[activeGroupTab]?.find(c => c.id === params.row.id)?.registrationNumber || '-'
              }
            </Box>
          </Box>
        ) : null,
    },
    {
      field: "index",
      headerName: "STT",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: params => {
        // Công thức tính STT liên tục
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (page - 1) * limit + rowIndex + 1;
      },
    },
    { field: "fullName", headerName: "Họ và tên", flex: 1.5 },
    { field: "studentCode", headerName: "Mã SV", flex: 1 },
    // { field: "schoolName", headerName: "Trường", flex: 1.5 },
    // { field: "className", headerName: "Lớp", flex: 1 },
    { field: "roundName", headerName: "Vòng đấu", flex: 1 },
    // {
    //   field: "groupName",
    //   headerName: "Nhóm",
    //   flex: 1,
    //   renderCell: (params: GridRenderCellParams<Contestant, string>) => {
    //     const groupName = params.row.groupName;
    //     if (!groupName) {
    //       return <Chip label="Chưa phân nhóm" size="small" color="default" />;
    //     }
    //     return <Chip label={groupName} size="small" color="primary" />;
    //   },
    // },
    // {
    //   field: "status",
    //   headerName: "Trạng thái",
    //   flex: 1,
    //   renderCell: (params: GridRenderCellParams<Contestant, string>) => {
    //     const status = params.row.status.trim();

    //     if (status === "compete") return <Chip label="Thi đấu" size="small" color="success" />;
    //     if (status === "eliminate") return <Chip label="Bị loại" size="small" color="error" />;
    //     return <Chip label="Qua vòng" size="small" color="info" />;
    //   },
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
  ]; return (
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
    }}>
      {/* <DataGrid
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
      /> */}

      <DataGrid2 // Đây thực chất là CommonDataGrid của bạn
        rows={contestants}
        columns={columns} // Truyền các cột dữ liệu
        getRowId={row => row.id}

        // Bật checkboxSelection tùy chỉnh của chúng ta
        checkboxSelection={true}

        // Truyền và nhận lại model lựa chọn
        selectionModel={selectedIds}
        onSelectChange={(newSelection) => {
          setSelectedIds(newSelection.map(id => Number(id)));
        }}

        // Các props còn lại
        disabledRowIds={assignedContestantIds}
        getRowClassName={(params) =>
          assignedContestantIds.includes(params.row.id) ? 'disabled-row' : ''
        }
      />
    </Box>
  );
}
