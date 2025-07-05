import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SchoolList from "../components/SchoolList";
import { useSchools } from "../hooks";
import { useDeleteSchool } from "../hooks/crud/deleteSchool";
import type { School, SchoolFilter } from "../types/school";
import CreateSchoolDialog from "../components/CreateSchoolDialog";
import SchoolDetailPopup from "../components/SchoolDetailPopup";
import EditSchoolDialog from "../components/EditSchoolDialog";
import { useToast } from "@contexts/toastContext";
const SchoolsPage: React.FC = () => {
  const { schools, loading, filter, updateFilter, pagination, refresh } =
    useSchools();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailPopupOpen, setDetailPopupOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(
    () => {
      document.title = "Quản lý Trường học";
      refresh(); // Làm mới danh sách trường học khi component mount
    },
    [refresh] // Chỉ chạy khi component mount
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutate: deleteSchool } = useDeleteSchool();

  const handleFilterChange = (newFilter: SchoolFilter) => {
    updateFilter(newFilter);
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleSchoolCreated = () => {
    refresh(); // Làm mới danh sách để hiển thị trường mới
  };

  // Xử lý khi người dùng nhấn nút xem chi tiết
  const handleViewDetail = (school: School) => {
    setSelectedSchool(school);
    setDetailPopupOpen(true);
  };

  const handleDeleteSchool = async (id: number) => {
    deleteSchool(id, {
      onSuccess: () => {
        showToast("Trường học đã được xóa thành công", "success");
        refresh(); // Làm mới danh sách sau khi xóa
      },
      onError: (error: any) => {
        showToast(
          error.response?.data.message || "Lỗi khi xóa trường học",
          "error"
        );
      },
    });
  };

  // Xử lý khi người dùng đóng popup chi tiết
  const handleCloseDetail = () => {
    setDetailPopupOpen(false);
  };

  // Xử lý khi người dùng nhấn nút chỉnh sửa
  const handleEdit = (school: School) => {
    setSelectedSchool(school);
    setEditDialogOpen(true);
  };

  // Xử lý khi người dùng đóng dialog chỉnh sửa
  const handleCloseEdit = () => {
    setEditDialogOpen(false);
  };

  // Xử lý khi cập nhật trường học thành công
  const handleSchoolUpdated = () => {
    refresh(); // Làm mới danh sách để hiển thị trường đã cập nhật
  };

  return (
    <>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Quản lý trường học
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            fullWidth={isMobile}
          >
            Thêm trường học
          </Button>
        </Box>

        <Paper
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            position: "relative",
            overflowX: "auto",
          }}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <SchoolList
            schools={schools}
            filter={filter}
            onFilterChange={handleFilterChange}
            pagination={pagination}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteSchool}
          />
        </Paper>

        {/* Dialog tạo trường học mới */}
        <CreateSchoolDialog
          open={isCreateDialogOpen}
          onClose={handleCloseCreateDialog}
          onCreated={handleSchoolCreated}
        />

        {/* Popup xem chi tiết trường học */}
        {selectedSchool && (
          <SchoolDetailPopup
            school={selectedSchool}
            open={isDetailPopupOpen}
            onClose={handleCloseDetail}
          />
        )}

        {/* Dialog chỉnh sửa trường học */}
        {selectedSchool && (
          <EditSchoolDialog
            school={selectedSchool}
            open={isEditDialogOpen}
            onClose={handleCloseEdit}
            onUpdated={handleSchoolUpdated}
          />
        )}
      </Box>

      {/* Notification Snackbar */}
    </>
  );
};

export default SchoolsPage;
