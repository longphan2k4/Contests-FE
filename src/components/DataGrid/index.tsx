import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface CommonDataGridProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  selectedIds?: (string | number)[];
  onSelectChange?: (selectedIds: (string | number)[]) => void;
  checkboxSelection?: boolean;
}

const CommonDataGrid = <T,>({
  rows,
  columns,
  getRowId,
  selectedIds,
  onSelectChange,
  checkboxSelection = true,
}: CommonDataGridProps<T>) => {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto", // Scroll ngang nếu bảng rộng
      }}
    >
      <Box
        sx={{
          minWidth: "600px", // hoặc lớn hơn nếu có nhiều cột
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          autoHeight
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          hideFooter
          onRowSelectionModelChange={(model: GridRowSelectionModel) => {
            if (onSelectChange) {
              onSelectChange(model as unknown as (string | number)[]);
            }
          }}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.100",
            },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default CommonDataGrid;
