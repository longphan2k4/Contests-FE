import { useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Input from './input';

type SearchableTableProps<T> = {
  data: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  searchField?: keyof T;
};

const SearchableTable = <T extends object>({
  data,
  columns,
  getRowId,
  searchField,
}: SearchableTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const filteredData = searchField
    ? data.filter((item) =>
        (item[searchField] as string).toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return (
    <Box>
      {searchField && (
        <Box mb={2}>
          <Input
            label="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      )}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={getRowId}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  );
};

export default SearchableTable;
