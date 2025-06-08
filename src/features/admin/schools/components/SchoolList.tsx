import React, { useState, useCallback } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import type { School, SchoolFilter } from "../types/school";
import { useSchoolList } from "../hooks/list/useSchoolList";
import { useDeleteSchool } from "../hooks";

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
  onEdit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    }
  );

  const [searchValue, setSearchValue] = useState(filter?.search || "");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [pageSize, setPageSize] = useState(filter?.limit || 10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

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

  // Xử lý thay đổi số lượng bản ghi trên mỗi trang
  const handlePageSizeChange = (event: SelectChangeEvent) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);

    if (onFilterChange) {
      onFilterChange({
        ...filter,
        limit: newPageSize,
        page: 1, // Reset về trang 1 khi thay đổi số lượng bản ghi
      });
    }
  };

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

  const { handleDeleteSchools } = useDeleteSchool();

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
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>

          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteSchools(selectedIds)}
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Xoá trường ({selectedIds.length})
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
              setSelectedIds(
                Array.from((selectionModel as unknown as { ids: number[] }).ids)
              );
            } else {
              setSelectedIds(selectionModel as number[]);
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
        <Box sx={{ mt: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "center", sm: "center" }}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "100%", sm: 100 },
              }}
            >
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(pageSize)}
                onChange={handlePageSizeChange}
                label="Hiển thị"
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
              size={isMobile ? "small" : "medium"}
              siblingCount={isMobile ? 0 : 1}
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
