// PaginationControl.tsx
import React from "react";
import {
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Đổi trang
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Đổi số item mỗi trang
  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    const newSize = parseInt(event.target.value, 10);
    if (newSize !== pageSize) {
      onPageSizeChange(newSize);
      onPageChange(1); // reset về page 1 khi đổi size
    }
  };

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Chọn số lượng item/trang */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 100 }}
        >
          <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
          <Select
            labelId="page-size-select-label"
            value={String(pageSize)}
            onChange={handlePageSizeChange}
            label="Hiển thị"
          >
            {[5, 10].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Điều hướng phân trang */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          size={isMobile ? "small" : "medium"}
          siblingCount={isMobile ? 0 : 1}
        />

        {/* Hiển thị số trang */}
        <Typography variant="body2" color="text.secondary">
          Trang {currentPage} / {totalPages}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PaginationControl;
