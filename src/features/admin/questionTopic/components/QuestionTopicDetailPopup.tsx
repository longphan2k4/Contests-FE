import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { QuestionTopic } from '../types/questionTopic';

interface QuestionTopicDetailPopupProps {
  questionTopic: QuestionTopic;
  open: boolean;
  onClose: () => void;
}

const QuestionTopicDetailPopup: React.FC<QuestionTopicDetailPopupProps> = ({
  questionTopic,
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InfoIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" component="div">
          Chi tiết chủ đề câu hỏi
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="h5" gutterBottom>
              {questionTopic.name}
            </Typography>
            <Chip
              label={questionTopic.isActive ? "Đang hoạt động" : "Đã ẩn"}
              color={questionTopic.isActive ? "success" : "error"}
              icon={questionTopic.isActive ? <CheckCircleIcon /> : <CancelIcon />}
              size="small"
              sx={{ mt: 1 }}
            />
            <Divider sx={{ my: 2 }} />
          </Box>

          {/* Thông tin bổ sung */}
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Thông tin bổ sung
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>
                <b>ID:</b> {questionTopic.id}
              </Typography>
              <Typography>
                <b>Số câu hỏi:</b> {questionTopic.questionsCount}
              </Typography>
              <Typography>
                <b>Ngày tạo:</b> {new Date(questionTopic.createdAt).toLocaleString('vi-VN')}
              </Typography>
              <Typography>
                <b>Ngày cập nhật:</b> {new Date(questionTopic.updatedAt).toLocaleString('vi-VN')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionTopicDetailPopup;