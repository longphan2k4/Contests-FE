import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert,
  Container
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { QuestionDetailList, QuestionDetailForm } from '../components';
import { 
  useCreateQuestionDetail,
  useUpdateQuestionDetail,
  useDeleteQuestionDetail
} from '../hooks';
import type { QuestionDetail, QuestionDetailFormData, Question } from '../types/questionDetail';

// Dữ liệu mẫu cho câu hỏi
const dummyQuestions: Question[] = [
  { id: 1, title: 'Câu hỏi mẫu 1', content: 'Nội dung câu hỏi mẫu 1' },
  { id: 2, title: 'Câu hỏi mẫu 2', content: 'Nội dung câu hỏi mẫu 2' },
  { id: 3, title: 'Câu hỏi mẫu 3', content: 'Nội dung câu hỏi mẫu 3' }
];

const QuestionDetailListPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedDetail, setSelectedDetail] = useState<QuestionDetail | null>(null);
  const [availableQuestions] = useState<Question[]>(dummyQuestions);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { create, loading: createLoading, error: createError, validationErrors: createValidationErrors } = useCreateQuestionDetail();
  const { update, loading: updateLoading, error: updateError, validationErrors: updateValidationErrors } = useUpdateQuestionDetail();
  const { softDelete, error: deleteError } = useDeleteQuestionDetail();
  
  const packageIdNumber = packageId ? parseInt(packageId) : undefined;

  const handleAddClick = () => {
    setFormMode('create');
    setSelectedDetail(null);
    setFormOpen(true);
  };

  const handleEditClick = (detail: QuestionDetail) => {
    setFormMode('edit');
    setSelectedDetail(detail);
    setFormOpen(true);
  };

  const handleDeleteClick = async (detail: QuestionDetail) => {
    try {
      await softDelete(detail.questionId, detail.questionPackageId);
      setNotification({
        open: true,
        message: 'Xóa câu hỏi thành công',
        severity: 'success'
      });
    } catch {
      setNotification({
        open: true,
        message: 'Lỗi khi xóa câu hỏi: ' + (deleteError || 'Đã xảy ra lỗi'),
        severity: 'error'
      });
    }
  };

  const handleFormSubmit = async (data: QuestionDetailFormData) => {
    try {
      if (formMode === 'create') {
        await create(data);
        setNotification({
          open: true,
          message: 'Thêm câu hỏi thành công',
          severity: 'success'
        });
      } else {
        if (selectedDetail) {
          await update(selectedDetail.questionId, selectedDetail.questionPackageId, data);
          setNotification({
            open: true,
            message: 'Cập nhật câu hỏi thành công',
            severity: 'success'
          });
        }
      }
      setFormOpen(false);
    } catch {
      setNotification({
        open: true,
        message: formMode === 'create' 
          ? 'Lỗi khi thêm câu hỏi: ' + (createError || 'Đã xảy ra lỗi')
          : 'Lỗi khi cập nhật câu hỏi: ' + (updateError || 'Đã xảy ra lỗi'),
        severity: 'error'
      });
    }
  };

  const handleViewClick = (detail: QuestionDetail) => {
    // TODO: Implement view functionality
    console.log('View detail:', detail);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý chi tiết câu hỏi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ mb: 2 }}
        >
          Thêm câu hỏi
        </Button>
      </Box>

      <QuestionDetailList
        packageId={packageIdNumber}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAdd={handleAddClick}
      />

      <QuestionDetailForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        questionDetail={selectedDetail || undefined}
        packageId={packageIdNumber}
        loading={createLoading || updateLoading}
        errors={formMode === 'create' ? createValidationErrors : updateValidationErrors}
        questions={availableQuestions}
        mode={formMode}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuestionDetailListPage; 