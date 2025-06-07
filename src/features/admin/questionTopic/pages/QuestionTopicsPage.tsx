import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QuestionTopicList from '../components/QuestionTopicList';
import QuestionTopicForm from '../components/QuestionTopicForm';
import { useQuestionTopicList } from '../hooks';
import type { QuestionTopic } from '../types/questionTopic';
import { useNotification } from '../../../../hooks';
import NotificationSnackbar from '../../components/NotificationSnackbar';
import { useCreateQuestionTopic, useUpdateQuestionTopic } from '../hooks/crud';
import type { CreateQuestionTopicInput, UpdateQuestionTopicInput } from '../schemas/questionTopic.schema';
import QuestionTopicDetailPopup from '../components/QuestionTopicDetailPopup';

const QuestionTopicsPage: React.FC = () => {
  const { loading, error, refresh } = useQuestionTopicList();
  const [selectedQuestionTopic, setSelectedQuestionTopic] = useState<QuestionTopic | null>(null);
  const [isDetailPopupOpen, setDetailPopupOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const {
    notificationState,
    showErrorNotification,
    showSuccessNotification,
    hideNotification
  } = useNotification();

  const { handleCreate: createQuestionTopic, isCreating } = useCreateQuestionTopic();
  const { handleUpdate: updateQuestionTopic, isUpdating } = useUpdateQuestionTopic();

  // Hiển thị lỗi từ api nếu có
  React.useEffect(() => {
    if (error) {
      showErrorNotification(error);
    }
  }, [error, showErrorNotification]);

  // Xử lý khi người dùng nhấn nút xem chi tiết
  const handleViewDetail = (questionTopic: QuestionTopic) => {
    setSelectedQuestionTopic(questionTopic);
    setDetailPopupOpen(true);
  };

  // Xử lý khi người dùng nhấn nút sửa
  const handleEdit = (questionTopic: QuestionTopic) => {
    setSelectedQuestionTopic(questionTopic);
    setEditDialogOpen(true);
  };

  // Xử lý khi người dùng nhấn nút thêm mới
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  // Xử lý khi đóng dialog
  const handleCloseDialog = () => {
    setDetailPopupOpen(false);
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
    setSelectedQuestionTopic(null);
  };

  // Xử lý khi submit form tạo mới
  const handleCreateSubmit = async (data: CreateQuestionTopicInput) => {
    try {
      await createQuestionTopic(data);
      showSuccessNotification('Tạo chủ đề mới thành công');
      handleCloseDialog();
      refresh();
    } catch {
      showErrorNotification('Có lỗi xảy ra khi tạo chủ đề mới');
    }
  };

  // Xử lý khi submit form cập nhật
  const handleUpdateSubmit = async (data: UpdateQuestionTopicInput) => {
    if (!selectedQuestionTopic) return;
    try {
      await updateQuestionTopic(selectedQuestionTopic.id, data);
      showSuccessNotification('Cập nhật chủ đề thành công');
      handleCloseDialog();
      refresh();
    } catch {
      showErrorNotification('Có lỗi xảy ra khi cập nhật chủ đề');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Quản lý chủ đề câu hỏi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Thêm chủ đề mới
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <QuestionTopicList
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
          />
        )}
      </Paper>

      <Dialog 
        open={isDetailPopupOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
      {selectedQuestionTopic && (
          <QuestionTopicDetailPopup
            questionTopic={selectedQuestionTopic}
            open={isDetailPopupOpen}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>

      <Dialog 
        open={isCreateDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <QuestionTopicForm
          onSubmit={handleCreateSubmit}
          onCancel={handleCloseDialog}
          isSubmitting={isCreating}
          mode="create"
        />
      </Dialog>

      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedQuestionTopic && (
          <QuestionTopicForm
            questionTopic={selectedQuestionTopic}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isUpdating}
            mode="edit"
          />
        )}
      </Dialog>

      <NotificationSnackbar
        open={notificationState.open}
        message={notificationState.message}
        severity={notificationState.severity}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default QuestionTopicsPage; 