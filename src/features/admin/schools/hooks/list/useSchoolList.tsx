import React from 'react';
import { useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import type { School, SchoolFilter } from '../../types/school';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import SchoolStatusSwitch from '../../components/SchoolStatusSwitch';

export const useSchoolList = (
  filter?: SchoolFilter,
  onFilterChange?: (filter: SchoolFilter) => void,
  onViewDetail?: (school: School) => void,
  onEdit?: (school: School) => void,
  onRefresh?: () => void
) => {
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const handleActiveFilterChange = (checked: boolean) => {
    setShowActiveOnly(checked);
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        isActive: checked ? true : undefined
      });
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        page
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'stt',
      headerName: 'STT',
      width: 70,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1
    },
    {
      field: 'name',
      headerName: 'Tên trường',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'phone',
      headerName: 'Điện thoại',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 200,
      renderCell: (params: GridRenderCellParams<School>) => (
        <SchoolStatusSwitch
          schoolId={params.row.id}
          isActive={params.row.isActive}
          onStatusChange={(newStatus) => {
            // Cập nhật lại dữ liệu trong bảng
            params.row.isActive = newStatus;
          }}
          onRefresh={onRefresh}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<School>) => (
        <div>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetail && params.row) {
                  onViewDetail(params.row);
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit && params.row) {
                  onEdit(params.row);
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return {
    showActiveOnly,
    columns,
    handlePageChange,
    handleActiveFilterChange
  };
}; 