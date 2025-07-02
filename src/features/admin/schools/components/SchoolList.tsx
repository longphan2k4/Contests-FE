import React, { useState, useCallback } from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Pagination,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import type { School, SchoolFilter } from "../types/school";
import { useSchoolList } from "../hooks/list/useSchoolList";
import { useDeleteSchool } from "../hooks/crud/useDeleteSchool";

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
  totalPages?: number;
  totalItems?: number;
  onViewDetail?: (school: School) => void;
  onEdit?: (school: School) => void;
  onDelete?: (id: number) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({
  schools,
  filter,
  onFilterChange,
  totalPages = 1,
  totalItems = 0,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  const { columns, handlePageChange } = useSchoolList(
    filter,
    onFilterChange,
    onViewDetail,
    onEdit,
    () => {
      // Gọi lại API để fetch dữ liệu mới
      if (onFilterChange) {
        onFilterChange({
          ...filter,
          page: filter?.page || 1,
        });
      }
    },
    onDelete
  );

  const [searchValue, setSearchValue] = useState(filter?.search || "");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { handleDeleteSchools, loading: deleteLoading } = useDeleteSchool();

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const success = await handleDeleteSchools(selectedIds);

    if (success) {
      // Refresh danh sách sau khi xóa thành công
      if (onFilterChange) {
        onFilterChange({
          ...filter,
          page: filter?.page || 1,
        });
      }
      // Reset danh sách đã chọn
      setSelectedIds([]);
    }
  };

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
              page: 1,
            });
          }
        }, 500);

        setSearchTimeout(timeoutId);
      }
    },
    [filter, onFilterChange, searchTimeout]
  );

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as "all" | "active" | "inactive";
    setStatusFilter(newStatus);
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        isActive: newStatus === "all" ? undefined : newStatus === "active",
        page: 1,
      });
    }
  };

  // Cleanup timeout khi component unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={2}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          width={{ xs: "100%", sm: "auto" }}
        >
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
            sx={{
              minWidth: { xs: "100%", sm: 300 },
              maxWidth: { xs: "100%", sm: 300 },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              maxWidth: { xs: "100%", sm: 150 },
            }}
          >
            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Đã vô hiệu hóa</MenuItem>
            </Select>
          </FormControl>

          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              disabled={deleteLoading}
              startIcon={
                deleteLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Xóa ({selectedIds.length})
            </Button>
          )}
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          alignSelf={{ xs: "flex-start", sm: "center" }}
        >
          Tổng số: {totalItems} trường học
        </Typography>
      </Box>

      <Box
        sx={{
          height: "auto",
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.paper,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      >
        <DataGrid
          rows={schools}
          columns={columns}
          getRowId={row => row.id}
          autoHeight
          disableRowSelectionOnClick
          hideFooter
          checkboxSelection
          onRowSelectionModelChange={selectionModel => {
            if (
              selectionModel &&
              typeof selectionModel === "object" &&
              "ids" in selectionModel
            ) {
              const newSelectedIds = Array.from(
                (selectionModel as unknown as { ids: number[] }).ids
              );
              setSelectedIds(newSelectedIds);
            } else {
              const newSelectedIds = selectionModel as number[];
              setSelectedIds(newSelectedIds);
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
      </Box>

      {/* Hiển thị phân trang chỉ khi có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={filter?.page || 1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default SchoolList;
