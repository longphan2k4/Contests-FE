import React, { useState, useEffect, useCallback } from 'react';
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
  useMediaQuery,
  Pagination
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { QuestionDetailDialogProps, AvailableQuestion } from '../types';
import { questionDetailService } from '../services/questionDetailService';
import { useToast } from '../../../../contexts/toastContext';

export const QuestionDetailDialog: React.FC<QuestionDetailDialogProps> = ({
  open,
  onClose,
  editingQuestion,
  totalQuestions,
  questionPackageId,
  onSuccess
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
  const [questions, setQuestions] = useState<AvailableQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<AvailableQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    questionType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await questionDetailService.getAvailableQuestions(questionPackageId, {
        page,
        limit: pageSize,
        isActive: true,
        difficulty: filters.difficulty || undefined,
        questionType: filters.questionType || undefined,
        search: searchTerm || undefined
      });

      if (response.data?.questions) {
        setQuestions(response.data.questions);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 0);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      showToast('Không thể lấy danh sách câu hỏi', 'error');
    } finally {
      setLoading(false);
    }
  }, [questionPackageId, page, pageSize, filters, searchTerm, showToast]);

  // Fetch questions khi filters hoặc searchTerm thay đổi
  useEffect(() => {
    if (open && questionPackageId) {
      fetchQuestions();
    }
  }, [open, questionPackageId, fetchQuestions]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedQuestions.length === 0) {
      showToast('Vui lòng chọn ít nhất một câu hỏi', 'warning');
      return;
    }

    try {
      const nextOrder = getNextOrder();

      // Tạo mảng chi tiết câu hỏi cần thêm theo format mới
      const response = await questionDetailService.bulkCreateQuestionDetails({
        questionPackageId,
        questions: selectedQuestions.map((question, index) => ({
          questionId: question.id,
          questionOrder: nextOrder + index
        }))
      });

      showToast(`Đã thêm thành công ${response.successful} câu hỏi vào gói`, 'success');
      
      // Reset các state
      setSelectedIds(new Set());
      setSelectedQuestions([]);
      setSearchTerm('');
      setFilters({ difficulty: '', questionType: '' });
      setPage(1);
      
      // Fetch lại danh sách câu hỏi có thể thêm
      await fetchQuestions();
      
      // Gọi callback để cập nhật danh sách câu hỏi trong gói
      if (onSuccess) {
        console.log('Gọi onSuccess để cập nhật danh sách câu hỏi trong gói');
        await onSuccess();
      } else {
        console.log('Không có callback onSuccess, cần fetch lại dữ liệu');
        // Nếu không có callback, tự fetch lại dữ liệu
        try {
          await fetchQuestions();
          console.log('Đã fetch lại dữ liệu question detail');
        } catch (fetchError) {
          console.error('Lỗi khi fetch lại dữ liệu:', fetchError);
        }
      }

      onClose();
    } catch (error) {
      console.error('❌ Lỗi khi thêm câu hỏi:', error);
      showToast('Đã xảy ra lỗi khi thêm câu hỏi', 'error');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleSelectQuestion = (question: AvailableQuestion) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(question.id)) {
      newSelectedIds.delete(question.id);
    } else {
      newSelectedIds.add(question.id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(questions.map(q => q.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleRemoveSelected = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchQuestions();
    }
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  // Cập nhật danh sách câu hỏi đã chọn khi selectedIds thay đổi
  useEffect(() => {
    const selected = questions.filter(q => selectedIds.has(q.id));
    setSelectedQuestions(selected);
  }, [selectedIds, questions]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      fullScreen={isFullScreen}
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: theme.shadows[24]
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pr: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          py: 2
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </Typography>
            {!editingQuestion && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tổng số câu hỏi trong gói: {totalQuestions}
              </Typography>
            )}
          </Box>
          <Box>
            <IconButton onClick={handleToggleFullScreen} size="small" sx={{ mr: 1 }}>
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
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
          </Box>
        </DialogTitle>

        <DialogContent 
          dividers 
          sx={{ 
            p: 0, 
            display: 'flex', 
            flexDirection: 'column',
            flex: 1,
            overflow: 'auto',
            bgcolor: 'background.default'
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2, p: 2 }}>
            {/* Cột trái - Danh sách câu hỏi */}
            <Box>
              <Box sx={{ mb: 3 }}>
                {editingQuestion && editingQuestion.question && (
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Câu hỏi hiện tại
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Nội dung:</Typography>
                      <Box 
                        dangerouslySetInnerHTML={{ __html: editingQuestion.question.content || '' }}
                        sx={{ 
                          mt: 1,
                          p: 1.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.default',
                          '& img': { maxWidth: '100%' }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Loại câu hỏi:</Typography>
                        <Typography>
                          {editingQuestion.question.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Độ khó:</Typography>
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
                          <IconButton onClick={fetchQuestions} edge="end">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <IconButton 
                    onClick={toggleFilters} 
                    sx={{ 
                      ml: 1,
                      bgcolor: showFilters ? 'primary.main' : 'transparent',
                      color: showFilters ? 'primary.contrastText' : 'inherit',
                      '&:hover': {
                        bgcolor: showFilters ? 'primary.dark' : 'action.hover',
                      }
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>

                {showFilters && (
                  <Paper 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: 'background.paper'
                    }}
                  >
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
                          <InputLabel>Loại câu hỏi</InputLabel>
                          <Select
                            value={filters.questionType}
                            onChange={(e) => handleFilterChange('questionType', e.target.value)}
                            label="Loại câu hỏi"
                          >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="multiple_choice">Trắc nghiệm</MenuItem>
                            <MenuItem value="essay">Tự luận</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    <TableContainer 
                      sx={{ 
                        maxHeight: 'calc(100vh - 400px)',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                      }}
                    >
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
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: 'action.hover'
                                  }
                                }}
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
                                <TableCell>{((page - 1) * pageSize) + index + 1}</TableCell>
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

                    <Box sx={{ 
                      mt: 2, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      bgcolor: 'background.paper',
                      p: 2,
                      borderRadius: 2
                    }}>
                      <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                        <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
                        <Select
                          labelId="page-size-select-label"
                          value={pageSize}
                          onChange={handlePageSizeChange}
                          label="Hiển thị"
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography>
                        Trang {page} / {totalPages}
                      </Typography>
                    </Box>

                    {totalPages > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          showFirstButton 
                          showLastButton  
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            '& .MuiPaginationItem-root': {
                              borderRadius: 1
                            }
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>

            {/* Cột phải - Danh sách câu hỏi đã chọn */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Câu hỏi đã chọn ({selectedQuestions.length})
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}
                >
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
                            p: 1.5,
                            mb: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            position: 'relative',
                            bgcolor: 'background.default'
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSelected(question.id)}
                            sx={{
                              position: 'absolute',
                              right: 4,
                              top: 4,
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.lighter'
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Câu {getNextOrder() + index}
                          </Typography>
                          <Typography
                            dangerouslySetInnerHTML={{ __html: question.content }}
                            sx={{
                              fontSize: '0.875rem',
                              mb: 1.5,
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
            </Box>
          </Box>
        </DialogContent>

        <DialogActions 
          sx={{ 
            borderTop: '1px solid', 
            borderColor: 'divider', 
            p: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Button 
            onClick={onClose} 
            color="inherit"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={selectedIds.size === 0 && !editingQuestion}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 