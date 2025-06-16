import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuestionDialogForm from './QuestionDialogForm';
import { useQuestionForm } from '../hooks/useQuestionForm';
import type { Question } from '../types';

export interface QuestionTopic {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

interface QuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  question: Question | null;
  isLoading: boolean;
  mode: 'view' | 'edit' | 'create';
  topics: QuestionTopic[];
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  question,
  isLoading,
  mode,
  topics,
}) => {
  const isReadOnly = mode === 'view';
  
  const {
    formData,
    errors,
    questionMediaFiles,
    mediaAnswerFiles,
    validateForm,
    prepareFormData,
    handleFormChange,
    handleContentChange,
    handleExplanationChange,
    handleOptionChange,
    addOption,
    removeOption,
    handleQuestionMediaChange,
    handleMediaAnswerChange,
    removeQuestionMedia,
    removeMediaAnswer,
  } = useQuestionForm({ question, mode, topics });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSubmit = prepareFormData(formData);
      await onSubmit(formDataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 1
      }}>
        {mode === 'create' ? 'Tạo câu hỏi' : mode === 'edit' ? 'Chỉnh sửa câu hỏi' : 'Chi tiết câu hỏi'}
        <IconButton 
          aria-label="close" 
          onClick={onClose} 
          sx={{ 
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: (theme) => theme.palette.grey[700],
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <QuestionDialogForm
          formData={formData}
          errors={errors}
          topics={topics}
          questionMediaFiles={questionMediaFiles}
          mediaAnswerFiles={mediaAnswerFiles}
          isReadOnly={isReadOnly}
          question={question}
          onFormChange={handleFormChange}
          onContentChange={handleContentChange}
          onExplanationChange={handleExplanationChange}
          onOptionChange={handleOptionChange}
          addOption={addOption}
          removeOption={removeOption}
          onQuestionMediaChange={handleQuestionMediaChange}
          onMediaAnswerChange={handleMediaAnswerChange}
          removeQuestionMedia={removeQuestionMedia}
          removeMediaAnswer={removeMediaAnswer}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {isReadOnly ? 'Đóng' : 'Hủy'}
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={(e) => handleSubmit(e as React.FormEvent)} 
            color="primary" 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog; 