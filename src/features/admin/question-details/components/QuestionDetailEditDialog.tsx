import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { QuestionDetail } from '../types';
import { useToast } from '../../../../contexts/toastContext';
import { questionDetailService } from '../services/questionDetailService';

interface QuestionDetailEditDialogProps {
  open: boolean;
  onClose: () => void;
  questionDetail: QuestionDetail | null;
  onSuccess?: () => Promise<void>;
}

const QuestionDetailEditDialog: React.FC<QuestionDetailEditDialogProps> = ({
  open,
  onClose,
  questionDetail,
  onSuccess
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullScreen, setIsFullScreen] = useState(isMobile);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    questionOrder: 0,
    isActive: true
  });

  // Cập nhật formData khi questionDetail thay đổi
  React.useEffect(() => {
    if (questionDetail) {
      setFormData({
        questionOrder: questionDetail.questionOrder || 0,
        isActive: questionDetail.isActive || false
      });
    }
  }, [questionDetail]);

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionDetail) return;
    
    setLoading(true);
    try {
      await questionDetailService.updateQuestionDetail(
        questionDetail.questionId,
        questionDetail.questionPackageId,
        {
          questionOrder: Number(formData.questionOrder),
          isActive: formData.isActive
        }
      );
      
      showToast('Cập nhật thành công', 'success');
      
      if (onSuccess) {
        await onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      showToast('Đã xảy ra lỗi khi cập nhật câu hỏi', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isFullScreen}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 1,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6">Chỉnh sửa câu hỏi trong gói</Typography>
        <Box>
          <IconButton onClick={handleToggleFullScreen} size="small">
            {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton 
            aria-label="close" 
            onClick={onClose} 
            size="small"
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {questionDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Thông tin câu hỏi</Typography>
                <Box 
                  dangerouslySetInnerHTML={{ __html: questionDetail.question?.content || '' }}
                  sx={{ 
                    p: 2, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& img': { maxWidth: '100%', height: 'auto' },
                    '& p': { margin: '0.5em 0' },
                    '& ul, & ol': { paddingLeft: '1.5em' }
                  }}
                />
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  name="questionOrder"
                  label="Thứ tự câu hỏi"
                  type="number"
                  value={formData.questionOrder}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                }
                label="Câu hỏi đang hoạt động"
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuestionDetailEditDialog; 