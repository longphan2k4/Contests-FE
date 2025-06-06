import React from 'react';
import { useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import type { School, SchoolFilter } from '../../types/school';
import TableActionButton from '../../../components/TableActionButton';

export const useSchoolList = (
  filter?: SchoolFilter,
  onFilterChange?: (filter: SchoolFilter) => void
) => {
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(filter?.isActive || false);

  // Xử lý thay đổi trang
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        page
      });
    }
  };

  // Xử lý thay đổi filter trạng thái hoạt động
  const handleActiveFilterChange = (checked: boolean) => {
    setShowActiveOnly(checked);
    
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        isActive: checked
      });
    }
  };

  // Định nghĩa các cột cho bảng
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Tên trường', flex: 2 },
    { field: 'address', headerName: 'Địa chỉ', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'SĐT', width: 150 },
    { 
      field: 'isActive', 
      headerName: 'Trạng thái', 
      width: 120,
      renderCell: (params: GridRenderCellParams<School>) => {
        const color = params.row.isActive ? 'green' : 'red';
        const text = params.row.isActive ? 'Hoạt động' : 'Đã khóa';
        return React.createElement('span', { style: { color } }, text);
      }
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<School>) => {
        return React.createElement(TableActionButton, {
          onView: () => {
            window.location.href = `/admin/schools/${params.row.id}`;
          },
          onEdit: () => {
            window.location.href = `/admin/schools/edit/${params.row.id}`;
          }
        });
      }
    },
  ];

  return {
    showActiveOnly,
    columns,
    handlePageChange,
    handleActiveFilterChange
  };
}; 