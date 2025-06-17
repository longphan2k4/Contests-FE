import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { QuestionDetailDialogProps } from '../types';
import { useQuestionDetailDialog } from '../hooks/useQuestionDetailDialog';
import { questionDetailService } from '../services/questionDetailService';
import { useToast } from '../../../../contexts/toastContext';

export const QuestionDetailDialog: React.FC<QuestionDetailDialogProps> = ({
  open,
  onClose,
  editingQuestion,
  totalQuestions,
  questionPackageId
}) => {
  console.debug('🔄 [QuestionDetailDialog] Component rendered:', {
    open,
    editingQuestion: !!editingQuestion,
    totalQuestions,
    questionPackageId
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFullScreen, setIsFullScreen] = useState(isMobile);
  const { showToast } = useToast();

  const {
    questions,
    loading,
    selectedQuestion,
    selectedIds,
    selectedQuestions,
    searchTerm,
    filters,
    showFilters,
    topics,
    handleSearchChange,
    handleSearch,
    handleFilterChange,
    handleSelectQuestion,
    handleSelectAll,
    handleSelectOne,
    handleRemoveSelected,
    handleKeyPress,
    toggleFilters
  } = useQuestionDetailDialog(open, questionPackageId);

  const handleToggleFullScreen = () => {
    console.debug('🔄 [QuestionDetailDialog] Toggle fullscreen:', !isFullScreen);
    setIsFullScreen(!isFullScreen);
  };

  // Lấy thứ tự bắt đầu từ cuối danh sách câu hỏi hiện tại
  const getNextOrder = () => {
    // Nếu đang chỉnh sửa câu hỏi hiện tại
    if (editingQuestion) {
      const currentOrder = editingQuestion.questionOrder || 0;
      return currentOrder + 1;
    }

    // Nếu đang thêm mới, bắt đầu từ tổng số câu hỏi hiện tại + 1
    return totalQuestions + 1;
  };

  const handleBulkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedQuestions.length === 0) {
      showToast('Vui lòng chọn ít nhất một câu hỏi', 'warning');
      return;
    }

    const nextOrder = getNextOrder();

    // Transform payload theo format mới
    const payload = {
      questionPackageId,
      questions: selectedQuestions.map((q, idx) => ({
        questionId: q.id,
        questionOrder: nextOrder + idx
      }))
    };

    console.log('📦 Payload gửi lên API:', {
      packageId: payload.questionPackageId,
      totalSelected: payload.questions.length,
      orderRange: `${nextOrder} -> ${nextOrder + payload.questions.length - 1}`,
      questions: payload.questions
    });

    try {
      const res = await questionDetailService.bulkCreateQuestionDetails(payload);
      showToast(`Đã thêm thành công câu hỏi vào gói ${res.successful} câu hỏi`, 'success');
      onClose();
      handleSearch();
    }
    catch (error) {
      console.error('❌ Lỗi khi thêm câu hỏi:', error);
      showToast('Đã xảy ra lỗi khi thêm câu hỏi', 'error');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      fullScreen={isFullScreen}
    >
      <form onSubmit={handleBulkSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pr: 1
        }}>
          <Box>
            <Typography variant="h6">
              {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </Typography>
            {!editingQuestion && (
              <Typography variant="body2" color="text.secondary">
                Tổng số câu hỏi trong gói: {totalQuestions}
              </Typography>
            )}
          </Box>
          <Box>
            <IconButton onClick={handleToggleFullScreen} size="small">
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
            {/* Cột trái - Danh sách câu hỏi */}
            <Box>
              <Box sx={{ mb: 3 }}>
                
                {editingQuestion && editingQuestion.question && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Câu hỏi hiện tại
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Nội dung:</Typography>
                      <Box 
                        dangerouslySetInnerHTML={{ __html: editingQuestion.question.content || '' }}
                        sx={{ 
                          mt: 1,
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          '& img': { maxWidth: '100%' }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Loại câu hỏi:</Typography>
                        <Typography>
                          {editingQuestion.question.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Độ khó:</Typography>
                        <Chip 
                          label={editingQuestion.question.difficulty || 'N/A'} 
                          size="small"
                          color={
                            editingQuestion.question.difficulty === 'Alpha' ? 'info' :
                            editingQuestion.question.difficulty === 'Beta' ? 'warning' :
                            editingQuestion.question.difficulty === 'Gold' ? 'success' : 'default'
                          }
                        />
                      </Box>
                    </Box>
                  </Paper>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    placeholder="Tìm kiếm câu hỏi..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearch} edge="end">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <IconButton onClick={toggleFilters} sx={{ ml: 1 }}>
                    <FilterListIcon />
                  </IconButton>
                </Box>

                {showFilters && (
                  <Box sx={{ mb: 2, p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                      <Box>
                        <FormControl fullWidth size="small">
                          <InputLabel>Độ khó</InputLabel>
                          <Select
                            value={filters.difficulty}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                            label="Độ khó"
                          >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Alpha">Alpha</MenuItem>
                            <MenuItem value="Beta">Beta</MenuItem>
                            <MenuItem value="Gold">Gold</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl fullWidth size="small">
                          <InputLabel>Chủ đề</InputLabel>
                          <Select
                            value={filters.topic}
                            onChange={(e) => handleFilterChange('topic', e.target.value)}
                            label="Chủ đề"
                          >
                            <MenuItem value="">Tất cả</MenuItem>
                            {topics.map((topic) => (
                              <MenuItem key={topic.id} value={topic.id.toString()}>
                                {topic.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                )}

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIds.size === questions.length && questions.length > 0}
                              indeterminate={selectedIds.size > 0 && selectedIds.size < questions.length}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>STT</TableCell>
                          <TableCell>Nội dung</TableCell>
                          {!isMobile && (
                            <>
                              <TableCell>Loại câu hỏi</TableCell>
                              <TableCell>Độ khó</TableCell>
                            </>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {questions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={isMobile ? 3 : 5} align="center">
                              Không tìm thấy câu hỏi nào
                            </TableCell>
                          </TableRow>
                        ) : (
                          questions.map((question, index) => (
                            <TableRow 
                              key={question.id}
                              hover
                              onClick={() => handleSelectQuestion(question)}
                              selected={selectedIds.has(question.id)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedIds.has(question.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleSelectOne(question.id, e.target.checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Typography
                                  dangerouslySetInnerHTML={{ __html: question.content }}
                                  sx={{
                                    maxWidth: 300,
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                  }}
                                />
                              </TableCell>
                              {!isMobile && (
                                <>
                                  <TableCell>
                                    {question.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={question.difficulty || 'N/A'}
                                      size="small"
                                      color={
                                        question.difficulty === 'Alpha' ? 'info' :
                                        question.difficulty === 'Beta' ? 'warning' :
                                        question.difficulty === 'Gold' ? 'success' : 'default'
                                      }
                                    />
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Box>

            {/* Cột phải - Danh sách câu hỏi đã chọn */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Câu hỏi đã chọn ({selectedQuestions.length})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {selectedQuestions.length === 0 ? (
                    <Typography color="text.secondary" align="center">
                      Chưa có câu hỏi nào được chọn
                    </Typography>
                  ) : (
                    <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                      {selectedQuestions.map((question, index) => (
                        <Box
                          key={question.id}
                          sx={{
                            p: 1,
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            position: 'relative'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSelected(question.id)}
                            sx={{
                              position: 'absolute',
                              right: 4,
                              top: 4
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="subtitle2" gutterBottom>
                            Câu {getNextOrder() + index}
                          </Typography>
                          <Typography
                            dangerouslySetInnerHTML={{ __html: question.content }}
                            sx={{
                              fontSize: '0.875rem',
                              mb: 1,
                              whiteSpace: 'normal',
                              overflowWrap: 'break-word',
                              wordBreak: 'break-word',
                            }}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={question.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                              size="small"
                              color={question.questionType === 'multiple_choice' ? 'primary' : 'secondary'}
                            />
                            <Chip
                              label={question.difficulty || 'N/A'}
                              size="small"
                              color={
                                question.difficulty === 'Alpha' ? 'info' :
                                question.difficulty === 'Beta' ? 'warning' :
                                question.difficulty === 'Gold' ? 'success' : 'default'
                              }
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>

              <Box>
                <input 
                  type="hidden" 
                  name="questionId" 
                  value={selectedQuestion?.id || editingQuestion?.questionId || ''} 
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={selectedIds.size === 0 && !editingQuestion}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 