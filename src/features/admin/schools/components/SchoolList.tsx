import React, { useState, useCallback, useEffect } from "react";
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

import DataGrid from "@components/DataGrid";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import type { School, SchoolFilter } from "../types/school";
import { useSchoolList } from "../hooks/list/useSchoolList";
import { useDeleteSchool } from "../hooks/crud/useDeleteSchool";

interface SchoolListProps {
  schools: School[];
  filter?: SchoolFilter;
  onFilterChange?: (filter: SchoolFilter) => void;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  onViewDetail?: (school: School) => void;
  onEdit?: (school: School) => void;
  onDelete?: (id: number) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({
  schools,
  filter = { page: 1, limit: 10 },
  onFilterChange,
  pagination = { totalPages: 1 },
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  const { columns } = useSchoolList(
    filter,
    onFilterChange,
    onViewDetail,
    onEdit,
    () => {
      if (onFilterChange) {
        onFilterChange({ ...filter, page: filter.page || 1 });
      }
    },
    onDelete
  );

  const [searchValue, setSearchValue] = useState(filter.search || "");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(
    filter?.isActive === undefined
      ? "all"
      : filter?.isActive
      ? "active"
      : "inactive"
  );

  const { handleDeleteSchools, loading: deleteLoading } = useDeleteSchool();

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const success = await handleDeleteSchools(selectedIds);
    if (success && onFilterChange) {
      onFilterChange({ ...filter, page: filter.page || 1 });
      setSelectedIds([]);
    }
  };

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      setSearchValue(value);
      if (searchTimeout) clearTimeout(searchTimeout);

      if (value.length >= 2 || value.length === 0) {
        const timeoutId = setTimeout(() => {
          if (onFilterChange) {
            onFilterChange({ ...filter, search: value, page: 1 });
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

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        sx={{
          alignItems: "stretch",
          mb: 2,
          gap: 2,
        }}
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
            flex: 1,
            minWidth: 200,
          }}
        />

        <FormControl
          size="small"
          sx={{
            flex: 1,
            minWidth: 200,
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
            sx={{
              flex: 1,
              minWidth: 200,
            }}
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
          >
            Xóa ({selectedIds.length})
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          width: "100%",
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderColor: "rgba(224, 224, 224, 1)" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.paper,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tổng số: {pagination.total} trường học
          </Typography>
        </Box>
        <DataGrid
          rows={schools}
          columns={columns}
          getRowId={row => row.id}
          selectedIds={selectedIds}
          onSelectChange={selection => {
            const idsArray = Array.isArray(selection)
              ? selection
              : Array.from((selection as any).ids || []);
            setSelectedIds(idsArray.map(id => Number(id)));
          }}
        />
      </Box>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
          <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
          <Select
            labelId="page-size-select-label"
            value={String(pagination.limit || 10)}
            onChange={e => {
              if (onFilterChange) {
                onFilterChange({
                  ...filter,
                  limit: Number(e.target.value),
                  page: 1,
                });
              }
            }}
            label="Hiển thị"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        <Typography>
          Trang {filter.page || 1} / {pagination.totalPages || 1}
        </Typography>
      </Box>
      {pagination.totalPages && pagination.totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={pagination.totalPages}
            page={filter.page ?? 1}
            color="primary"
            onChange={(_event, value) => {
              if (onFilterChange) {
                onFilterChange({ ...filter, page: value });
              }
            }}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default SchoolList;
