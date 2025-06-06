import React from 'react';
import { Box, FormControlLabel, Checkbox, Pagination } from '@mui/material';
import type { School, SchoolFilter } from '../types/school';
import SearchableTable from '../../components/SearchableTable';
import { useSchoolList } from '../hooks/list/useSchoolList';

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
  totalPages?: number;
}

const SchoolList: React.FC<SchoolListProps> = ({ 
  schools, 
  filter, 
  onFilterChange,
  totalPages = 1
}) => {
  const {
    showActiveOnly,
    columns,
    handlePageChange,
    handleActiveFilterChange
  } = useSchoolList(filter, onFilterChange);

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