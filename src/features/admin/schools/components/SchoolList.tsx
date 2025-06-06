import { useState } from 'react';
import { Box, FormControlLabel, Checkbox, Pagination } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchableTable from '../../components/SearchableTable';
import TableActionButton from '../../components/TableActionButton';
import type { School, SchoolFilter } from '../types/school';

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
  totalPages?: number;
}

const SchoolList = ({ 
  schools, 
  filter, 
  onFilterChange,
  totalPages = 1
}: SchoolListProps) => {
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

  // Handle local filter changes
  const handleActiveFilterChange = (checked: boolean) => {
    setShowActiveOnly(checked);
    
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        isActive: checked
      });
    }
  };

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
      renderCell: (params: GridRenderCellParams<School>) => (
        <span style={{ color: params.row.isActive ? 'green' : 'red' }}>
          {params.row.isActive ? 'Hoạt động' : 'Đã khóa'}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<School>) => (
        <TableActionButton
          onView={() => {
            window.location.href = `/admin/schools/${params.row.id}`;
          }}
          onEdit={() => {
            window.location.href = `/admin/schools/edit/${params.row.id}`;
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>          
          <FormControlLabel
            control={
              <Checkbox 
                checked={showActiveOnly}
                onChange={(e) => handleActiveFilterChange(e.target.checked)}
              />
            }
            label="Chỉ hiện trường đang hoạt động"
          />
        </Box>
      </Box>

      <SearchableTable
        data={schools}
        columns={columns}
        getRowId={(row) => row.id}
        searchField="name"
      />

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={filter?.page || 1}
            onChange={handlePageChange}
            color="primary" 
          />
        </Box>
      )}
    </>
  );
};

export default SchoolList; 