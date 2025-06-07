import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Pagination,
  TextField,
  InputAdornment,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  IconButton
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { School, SchoolFilter } from '../types/school';
import { useSchoolList } from '../hooks/list/useSchoolList';
import { useDeleteSchool } from '../hooks';

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
  totalPages?: number;
  totalItems?: number;
  onViewDetail?: (school: School) => void;
  onEdit?: (school: School) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({ 
  schools, 
  filter, 
  onFilterChange,
  totalPages = 1,
  totalItems = 0,
  onViewDetail,
  onEdit
}) => {
  const {
    columns,
    handlePageChange
  } = useSchoolList(filter, onFilterChange, onViewDetail, onEdit);

  const [searchValue, setSearchValue] = useState(filter?.search || '');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pageSize, setPageSize] = useState(filter?.limit || 10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(filter?.isActive);

  console.log("selectedIds", selectedIds);
  console.log('length', selectedIds.length);
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchValue(value);

    // Xóa timeout cũ nếu có
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Chỉ tìm kiếm khi từ khóa có độ dài >= 2 ký tự
    if (value.length >= 2 || value.length === 0) {
      const timeoutId = setTimeout(() => {
        if (onFilterChange) {
          onFilterChange({
            ...filter,
            search: value,
            page: 1
          });
        }
      }, 500);

      setSearchTimeout(timeoutId);
    }
  }, [filter, onFilterChange, searchTimeout]);

  // Xử lý thay đổi số lượng bản ghi trên mỗi trang
  const handlePageSizeChange = (event: SelectChangeEvent) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        limit: newPageSize,
        page: 1 // Reset về trang 1 khi thay đổi số lượng bản ghi
      });
    }
  };

  // Debug log
  // console.log("Render SchoolList with:", { 
  //   currentPage: filter?.page, 
  //   totalPages, 
  //   totalItems,
  //   schoolsCount: schools.length
  // });

  // Cleanup timeout khi component unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
  const { handleDeleteSchools } = useDeleteSchool();
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={2} alignItems="center">
        <IconButton
          color={activeFilter ? "primary" : "default"}
          onClick={() => {
            const newValue = !activeFilter;
            setActiveFilter(newValue);
            if (onFilterChange) {
              onFilterChange({
                ...filter,
                isActive: newValue ? true : undefined,
                page: 1
              });
            }
          }}
          sx={{ ml: 1 }}
          >
      <FilterListIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Tìm kiếm trường học"
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        {selectedIds.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteSchools(selectedIds)}
          >
            Xoá trường ({selectedIds.length})
          </Button>
        )}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Tổng số: {totalItems} trường học
        </Typography>
      </Box>

      <DataGrid
        rows={schools}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        disableRowSelectionOnClick
        hideFooter
        checkboxSelection
        onRowSelectionModelChange={(selectionModel) => {
          if (selectionModel && typeof selectionModel === 'object' && 'ids' in selectionModel) {
            setSelectedIds(Array.from((selectionModel as unknown as { ids: number[] }).ids));
          } else {
            setSelectedIds(selectionModel as number[]);
          }
        }}
          sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none'
          },
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          mb: 2
        }}
      />

      {/* Hiển thị phân trang chỉ khi có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2} 
            justifyContent="space-between" 
            alignItems={{ xs: 'center', sm: 'center' }}
          >
            <FormControl variant="outlined" size="small">
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(pageSize)}
                onChange={handlePageSizeChange}
                label="Hiển thị"
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="25">25</MenuItem>
                <MenuItem value="50">50</MenuItem>
              </Select>
            </FormControl>
            
            <Pagination 
              count={totalPages} 
              page={filter?.page || 1}
              onChange={handlePageChange}
              color="primary" 
              showFirstButton 
              showLastButton
              size="medium"
              siblingCount={1}
            />
            
            <Typography variant="body2" color="text.secondary">
              Trang {filter?.page || 1} / {totalPages}
            </Typography>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default SchoolList; 