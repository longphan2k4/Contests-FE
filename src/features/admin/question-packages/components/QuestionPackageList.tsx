import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useQuestionPackages } from '../hooks/useQuestionPackages';
import type { QuestionPackage } from '../types/questionPackage';
import { QuestionPackageForm } from './QuestionPackageForm';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface QuestionPackageListProps {
  onView?: (questionPackage: QuestionPackage) => void;
}

const QuestionPackageList: React.FC<QuestionPackageListProps> = ({
  onView
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<QuestionPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    questionPackages,
    pagination,
    loading,
    filter,
    updateFilter,
    create,
    update,
    delete: deletePackage,
    updateStatus
  } = useQuestionPackages();

  const handleOpenForm = (packageData?: QuestionPackage) => {
    setSelectedPackage(packageData || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedPackage(null);
    setOpenForm(false);
  };

  const handleSubmit = (data: { name: string; isActive?: boolean }) => {
    if (selectedPackage) {
      update({ id: selectedPackage.id, data });
    } else {
      create(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói câu hỏi này?')) {
      deletePackage(id);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    updateFilter({ search: event.target.value, page: 1 });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    updateFilter({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter({ limit: parseInt(event.target.value, 10), page: 1 });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Quản lý gói câu hỏi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
            >
              Thêm gói câu hỏi
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm gói câu hỏi..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Bộ lọc
            </Button>
          </Box>

          {showFilters && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  value={filter.isActive ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFilter({ 
                      isActive: value === '' ? undefined : value === 'true' 
                    });
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Sắp xếp theo"
                  value={filter.sortBy ?? 'createdAt'}
                  onChange={(e) => {
                    const value = e.target.value as 'name' | 'createdAt' | 'updatedAt';
                    updateFilter({ sortBy: value });
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="name">Tên</option>
                  <option value="createdAt">Ngày tạo</option>
                  <option value="updatedAt">Ngày cập nhật</option>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Thứ tự"
                  value={filter.sortOrder ?? 'desc'}
                  onChange={(e) => {
                    const value = e.target.value as 'asc' | 'desc';
                    updateFilter({ sortOrder: value });
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </TextField>
              </Box>
            </Paper>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên gói câu hỏi</TableCell>
                  <TableCell align="center">Số câu hỏi</TableCell>
                  <TableCell align="center">Số trận đấu</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Ngày tạo</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : questionPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  questionPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.name}</TableCell>
                      <TableCell align="center">{pkg.questionDetailsCount}</TableCell>
                      <TableCell align="center">{pkg.matchesCount}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={pkg.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                          color={pkg.isActive ? 'success' : 'error'}
                          size="small"
                          onClick={() => updateStatus({ id: pkg.id, isActive: !pkg.isActive })}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {format(new Date(pkg.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenForm(pkg)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(pkg.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView?.(pkg)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination?.total || 0}
            page={(pagination?.page || 1) - 1}
            onPageChange={handleChangePage}
            rowsPerPage={pagination?.limit || 10}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </CardContent>
      </Card>

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPackage ? 'Cập nhật gói câu hỏi' : 'Thêm gói câu hỏi mới'}
        </DialogTitle>
        <DialogContent>
          <QuestionPackageForm
            initialData={selectedPackage ? {
              name: selectedPackage.name,
              isActive: selectedPackage.isActive
            } : undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QuestionPackageList; 