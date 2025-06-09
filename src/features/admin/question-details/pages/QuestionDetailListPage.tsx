import React, { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  Stack,
  Checkbox,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useQuestionDetails } from '../hooks/useQuestionDetails';
import { QuestionDetailDialog } from '../components/QuestionDetailDialog';
import type { QuestionDetail } from '../types';

const QuestionDetailListPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    questionDetails,
    loading,
    error,
    selectedIds,
    setSelectedIds,
    total,
    totalPages,
    filter,
    updateFilter,
    handleDeleteSelected,
    handleCreateOrUpdate,
  } = useQuestionDetails();

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    updateFilter({ page });
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    updateFilter({ limit: newRowsPerPage, page: 1 });
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: QuestionDetail) => {
    setEditingQuestion(record);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleDialogSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      questionId: Number(formData.get('questionId')),
      questionOrder: Number(formData.get('questionOrder')),
      isActive: formData.get('isActive') === 'true'
    };

    const success = await handleCreateOrUpdate(values);
    if (success) {
      handleDialogClose();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    updateFilter({ page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Quản lý chi tiết gói câu hỏi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm câu hỏi vào gói 
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          {selectedIds.size > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              startIcon={<DeleteIcon />}
            >
              Xóa ({selectedIds.size})
            </Button>
          )}
          <Box flex={1} />

          <Typography sx={{ alignSelf: 'center' }}>
            Tổng số: {total} câu hỏi
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : questionDetails.length === 0 ? (
          <Typography sx={{ textAlign: 'center', p: 3 }}>
            Không có dữ liệu
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.size === questionDetails.length && questionDetails.length > 0}
                        indeterminate={selectedIds.size > 0 && selectedIds.size < questionDetails.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(new Set(questionDetails.map(q => q.questionId)));
                          } else {
                            setSelectedIds(new Set());
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell width={80}>STT</TableCell>
                    <TableCell>Tiêu đề câu hỏi</TableCell>
                    <TableCell width={120}>Loại câu hỏi</TableCell>
                    <TableCell width={120}>Độ khó</TableCell>
                    <TableCell width={120}>Trạng thái</TableCell>
                    <TableCell width={150}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionDetails.map((row) => (
                    <TableRow key={`${row.questionId}-${row.questionPackageId}`}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(row.questionId)}
                          onChange={(e) => {
                            const newSelectedIds = new Set(selectedIds);
                            if (e.target.checked) {
                              newSelectedIds.add(row.questionId);
                            } else {
                              newSelectedIds.delete(row.questionId);
                            }
                            setSelectedIds(newSelectedIds);
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.questionOrder}</TableCell>
                      <TableCell>{row.question?.plainText || 'Không có tiêu đề'}</TableCell>
                      <TableCell>
                        {row.question?.questionType === 'multiple_choice' ? 'Trắc nghiệm' : 
                         row.question?.questionType === 'essay' ? 'Tự luận' : row.question?.questionType}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.question?.difficulty || 'N/A'}
                          color={
                            row.question?.difficulty === 'Alpha' ? 'info' :
                            row.question?.difficulty === 'Beta' ? 'warning' :
                            row.question?.difficulty === 'Gold' ? 'success' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                          color={row.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>

                        <Stack direction="row" spacing={1}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(row)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
                <Select
                  labelId="page-size-select-label"
                  value={String(filter.limit)}
                  onChange={handleChangeRowsPerPage}
                  label="Hiển thị"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Typography>
                Trang {filter.page} / {totalPages}
              </Typography>
            </Box>

            {totalPages > 0 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={filter.page}
                  onChange={handlePageChange}
                  showFirstButton 
                  showLastButton  
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      <QuestionDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        editingQuestion={editingQuestion}
      />
    </Box>
  );
};

export default QuestionDetailListPage; 