import {
    DataGrid,
    type GridColDef,
    // type GridRowSelectionModel,
    type GridRowParams,
    type GridColumnHeaderParams, // Import thêm
} from "@mui/x-data-grid";
import { Box, Checkbox } from "@mui/material";

interface CommonDataGridProps<T> {
    rows: T[];
    columns: GridColDef[];
    getRowId: (row: T) => string | number;

    // Dùng `selectionModel` để điều khiển các dòng được chọn từ bên ngoài
    selectionModel?: (string | number)[];

    onSelectChange?: (newSelectionModel: (string | number)[]) => void;
    checkboxSelection?: boolean;
    disabledRowIds?: (string | number)[];
    getRowClassName?: (params: GridRowParams) => string;
}

const CommonDataGrid = <T extends { id: string | number }>({ // Thêm ràng buộc T phải có id
    rows,
    columns: propColumns,
    getRowId,
    selectionModel = [],
    onSelectChange,
    checkboxSelection = true,
    disabledRowIds = [],
    getRowClassName,
}: CommonDataGridProps<T>) => {

    // Logic cho checkbox "Chọn tất cả" tùy chỉnh
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const CustomHeaderCheckbox = (_props: GridColumnHeaderParams) => {
        const selectableIdsOnPage = rows
            .map(row => getRowId(row))
            .filter(id => !disabledRowIds.includes(id));

        const selectedOnPageCount = selectableIdsOnPage.filter(id => selectionModel.includes(id)).length;

        const handleSelectAllOnPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                // Thêm tất cả các mục có thể chọn của trang này vào danh sách tổng
                const newSelectedIds = [...new Set([...selectionModel, ...selectableIdsOnPage])];
                onSelectChange?.(newSelectedIds);
            } else {
                // Loại bỏ tất cả các mục của trang này khỏi danh sách tổng
                const newSelectedIds = selectionModel.filter(id => !selectableIdsOnPage.includes(id));
                onSelectChange?.(newSelectedIds);
            }
        };

        return (
            <Checkbox
                checked={selectableIdsOnPage.length > 0 && selectedOnPageCount === selectableIdsOnPage.length}
                indeterminate={selectedOnPageCount > 0 && selectedOnPageCount < selectableIdsOnPage.length}
                onChange={handleSelectAllOnPage}
                color="primary"
            />
        );
    };

    // Tạo một cột checkbox tùy chỉnh nếu `checkboxSelection` được bật
    const selectionColumn: GridColDef = {
        field: 'selection',
        headerName: 'Chọn',
        width: 60,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderHeader: (params) => <CustomHeaderCheckbox {...params} />,
        renderCell: (params) => {
            const isSelectable = !disabledRowIds.includes(params.id);
            return (
                <Checkbox
                    checked={selectionModel.includes(params.id)}
                    disabled={!isSelectable}
                    onChange={(event) => {
                        const newSelectedIds = event.target.checked
                            ? [...selectionModel, params.id]
                            : selectionModel.filter(id => id !== params.id);
                        onSelectChange?.(newSelectedIds);
                    }}
                />
            );
        }
    };

    const finalColumns = checkboxSelection ? [selectionColumn, ...propColumns] : propColumns;

    return (
        <Box sx={{ width: "100%", /* ... */ }}>
            <Box sx={{ minWidth: "600px", /* ... */ }}>
                <DataGrid
                    rows={rows}
                    // Sử dụng cột đã được tùy chỉnh
                    columns={finalColumns}
                    getRowId={getRowId}
                    autoHeight

                    // Tắt checkboxSelection mặc định vì ta đã tự tạo
                    checkboxSelection={false}

                    disableRowSelectionOnClick
                    hideFooter
                    isRowSelectable={(params) => !disabledRowIds.includes(params.id)}
                    getRowClassName={getRowClassName}

                    // Không cần 2 props này nữa vì ta xử lý trong renderCell
                    // rowSelectionModel={selectionModel}
                    // onRowSelectionModelChange={...}
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
