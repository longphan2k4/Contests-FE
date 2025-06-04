import { useState, useEffect } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchableTable from '../../components/SearchableTable';
import TableActionButton from '../../components/TableActionButton';
import SelectFilter from '../../components/Select';
import type { School } from '../types';
import type { SchoolFilter } from '../types/school';

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
}

const SchoolList = ({ schools, filter, onFilterChange }: SchoolListProps) => {
  const [filteredData, setFilteredData] = useState<School[]>(schools);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(filter?.isActive || false);

  // Chỉ áp dụng bộ lọc local, không gọi API lại
  useEffect(() => {
    let result = schools;
    
    // Lọc theo trạng thái hoạt động
    if (showActiveOnly) {
      result = result.filter(school => school.isActive);
    }
    
    setFilteredData(result);
  }, [schools, showActiveOnly]);

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

  // Danh sách các thành phố để lọc
  const cities = Array.from(new Set(schools.map(school => school.city)));

  const handleCityFilter = (cityFilteredData: School[]) => {
    setFilteredData(showActiveOnly 
      ? cityFilteredData.filter(school => school.isActive)
      : cityFilteredData
    );
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <SelectFilter<School>
            label="Lọc theo thành phố"
            field="city"
            options={cities}
            data={schools}
            onFilter={handleCityFilter}
          />
          
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
        data={filteredData}
        columns={columns}
        getRowId={(row) => row.id}
        searchField="name"
      />
    </>
  );
};

export default SchoolList; 