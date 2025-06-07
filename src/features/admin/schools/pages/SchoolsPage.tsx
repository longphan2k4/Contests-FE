import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolList from '../components/SchoolList';
import { useSchools } from '../hooks';
import type { School, SchoolFilter } from '../types/school';
import CreateSchoolDialog from '../components/CreateSchoolDialog';
import SchoolDetailPopup from '../components/SchoolDetailPopup';
import EditSchoolDialog from '../components/EditSchoolDialog';
import { useNotification } from '../../../../hooks';
import  NotificationSnackbar  from '../../components/NotificationSnackbar';

const SchoolsPage: React.FC = () => {
  const { schools, loading, error, filter, updateFilter, totalPages, total, refresh } = useSchools();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailPopupOpen, setDetailPopupOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const {
    notificationState,
    showErrorNotification,
    hideNotification
  } = useNotification();

  // Hiển thị lỗi từ api nếu có
  useEffect(() => {
    if (error) {
      showErrorNotification(error);
    }
  }, [error, showErrorNotification]);

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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Quản lý trường học</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Thêm trường học
          </Button>
        </Box>

        <Paper sx={{ p: 3, position: 'relative' }}>
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}

          <SchoolList
            schools={schools}
            filter={filter}
            onFilterChange={handleFilterChange}
            totalPages={totalPages}
            totalItems={total}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
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
      <NotificationSnackbar 
        open={notificationState.open}
        onClose={hideNotification}
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
      />
    </>
  );
};

export default SchoolsPage; 