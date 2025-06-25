import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
  type GridRowParams,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface CommonDataGridProps<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string | number;
  selectedIds?: (string | number)[];
  onSelectChange?: (selectedIds: (string | number)[]) => void;
  checkboxSelection?: boolean;
  disabledRowIds?: (string | number)[];
  getRowClassName?: (params: GridRowParams) => string;
}

const CommonDataGrid = <T,>({
  rows,
  columns,
  getRowId,
  selectedIds,
  onSelectChange,
  checkboxSelection = true,
  disabledRowIds = [],
  getRowClassName,
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
      >        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          autoHeight
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          hideFooter
          isRowSelectable={(params) => !disabledRowIds.includes(params.id)}
          getRowClassName={getRowClassName}
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
            "& .disabled-row": {
              backgroundColor: "#f5f5f5",
              color: "#666",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            },
            "& .disabled-row .MuiCheckbox-root": {
              color: "#ccc",
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
