import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
  type GridRowClassNameParams,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface CommonDataGridProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  selectedIds?: (string | number)[];
  onSelectChange?: (selectedIds: (string | number)[]) => void;
  checkboxSelection?: boolean;
  // New props for responsiveness
  responsiveColumns?: { [key: string]: { xs?: string; sm?: string } }; // e.g., { field: { xs: "none", sm: "table-cell" } }
  // New props for disabled rows
  disabledRowIds?: (string | number)[];
  getRowClassName?: (params: GridRowClassNameParams) => string;
}

const CommonDataGrid = <T,>({
  rows,
  columns,
  getRowId,
  selectedIds,
  onSelectChange,
  responsiveColumns = {},
}: CommonDataGridProps<T>) => {
  // Map columns to include responsive display styles
  const responsiveColumnsDef: GridColDef[] = columns.map(col => ({
    ...col,
    headerClassName: "data-grid-header",
    cellClassName: "data-grid-cell",
    ...(responsiveColumns[col.field]
      ? {
          sx: {
            display: responsiveColumns[col.field] || {
              xs: "table-cell",
              sm: "table-cell",
            },
          },
        }
      : {}),
  }));

  return (
    <DataGrid
      rows={rows}
      columns={responsiveColumnsDef}
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
        "& .data-grid-header": {
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "4px 8px", sm: "8px 16px" },
        },
        "& .data-grid-cell": {
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "4px 8px", sm: "8px 16px" },
        },
        "& .MuiDataGrid-checkboxInput": {
          transform: { xs: "scale(0.9)", sm: "scale(1)" },
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        mb: { xs: 1, sm: 2 },
        // Ensure table fits within parent container
        width: "100%",
        overflowX: "auto",
      }}
    />
  );
};

export default CommonDataGrid;
