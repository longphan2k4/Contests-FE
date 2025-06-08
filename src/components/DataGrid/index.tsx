// src/components/common/CommonDataGrid.tsx

import React from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

interface CommonDataGridProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  selectedIds?: (string | number)[];
  onSelectChange?: (selectedIds: (string | number)[]) => void;
}

const CommonDataGrid = <T,>({
  rows,
  columns,
  getRowId,
  selectedIds,
  onSelectChange,
}: CommonDataGridProps<T>) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      autoHeight
      disableRowSelectionOnClick
      hideFooter
      checkboxSelection
      onRowSelectionModelChange={(model: GridRowSelectionModel) => {
        if (onSelectChange) {
          onSelectChange(model as unknown as (string | number)[]);
        }
      }}
      sx={{
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        mb: 2,
      }}
    />
  );
};

export default CommonDataGrid;
