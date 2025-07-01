import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Stack,
  InputAdornment,
  Alert,
  Typography,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Giả định các hooks này đã được tạo và export từ file hook của bạn
import {
  useEliminatedContestantsWithFilter,
  useAddStudentsToRescue
} from '../hook/useRescue';

// Định nghĩa kiểu dữ liệu cho thí sinh để sử dụng trong component
// Bạn nên đặt type này ở một file dùng chung (ví dụ: types.ts)
export type EliminatedContestant = {
  contestantId: number;
  fullName: string;
  studentCode: string | null;
  schoolName: string;
  className: string;
  eliminatedAtQuestionOrder: number | null;
};

// Định nghĩa props cho component
interface EliminatedContestantDialogProps {
  open: boolean;
  onClose: () => void;
  matchId: number;
  rescueId: number; // Cần rescueId để biết thêm thí sinh vào đợt cứu trợ nào
  existingRescuedIds: number[]; // Mảng các ID đã có sẵn để vô hiệu hóa checkbox
}

const EliminatedContestantDialog: React.FC<EliminatedContestantDialogProps> = ({
  open,
  onClose,
  matchId,
  rescueId,
  existingRescuedIds
}) => {
  // State quản lý các bộ lọc (phân trang, tìm kiếm)
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  // State quản lý danh sách các thí sinh được chọn bằng checkbox
  const [selected, setSelected] = useState<EliminatedContestant[]>([]);

  // Sử dụng hook để lấy dữ liệu từ API
  const {
    data,
    isLoading,
    isError,
    error,
  } = useEliminatedContestantsWithFilter(matchId, filters);

  // Sử dụng hook mutation để thêm thí sinh vào đợt cứu trợ
  const addMutation = useAddStudentsToRescue();

  // Dữ liệu và thông tin phân trang được lấy ra từ hook một cách an toàn
  const contestants = useMemo(() => data?.contestants || [], [data]);
  const pagination = useMemo(() => data?.pagination, [data]);

  // Xử lý khi người dùng chọn/bỏ chọn một checkbox
  const handleSelect = (contestant: EliminatedContestant) => {
    setSelected(prev =>
      prev.some(c => c.contestantId === contestant.contestantId)
        ? prev.filter(c => c.contestantId !== contestant.contestantId)
        : [...prev, contestant]
    );
  };

  // Xử lý khi nhấn nút "Thêm"
  const handleAdd = () => {
    if (selected.length === 0) return;
    const studentIds = selected.map(c => c.contestantId);
    addMutation.mutate({ rescueId, studentIds }, {
      onSuccess: () => {
        // Thông báo thành công (nếu cần, dùng context/toast)
        // alert(`Đã thêm ${studentIds.length} thí sinh.`);
        onClose(); // Đóng dialog sau khi thành công
      },
      onError: (err) => {
        // Thông báo lỗi
        console.error("Lỗi khi thêm thí sinh:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    });
  };
  
  // Reset state `selected` mỗi khi dialog được đóng
  useEffect(() => {
    if (!open) {
      setSelected([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Thêm thí sinh vào danh sách cứu trợ</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Khu vực tìm kiếm */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, mã sinh viên, trường, lớp..."
            size="small"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Xử lý các trạng thái của API */}
          {isError && <Alert severity="error">Lỗi tải dữ liệu: {error?.message || 'Không xác định'}</Alert>}
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Họ và Tên</TableCell>
                    <TableCell>Trường</TableCell>
                    <TableCell>Bị loại ở câu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contestants.length > 0 ? (
                    contestants.map((c) => {
                      const isSelected = selected.some(s => s.contestantId === c.contestantId);
                      const isDisabled = existingRescuedIds.includes(c.contestantId);
                      return (
                        <Tooltip
                          key={c.contestantId}
                          title={isDisabled ? "Thí sinh đã có trong danh sách cứu trợ" : "Nhấn để chọn"}
                          placement="top"
                          arrow
                        >
                          <TableRow
                            hover
                            onClick={() => !isDisabled && handleSelect(c)}
                            selected={isSelected}
                            sx={{
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              opacity: isDisabled ? 0.6 : 1,
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isSelected} disabled={isDisabled} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Typography variant="body2" fontWeight="medium">{c.fullName}</Typography>
                              <Typography variant="caption" color="text.secondary">{c.studentCode}</Typography>
                            </TableCell>
                            <TableCell>{c.schoolName}</TableCell>
                            <TableCell align="center">{c.eliminatedAtQuestionOrder}</TableCell>
                          </TableRow>
                        </Tooltip>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary" sx={{ p: 3 }}>
                          Không tìm thấy thí sinh nào.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Phân trang */}
          {pagination && pagination.totalPages > 1 && (
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={pagination.totalPages}
                page={filters.page}
                onChange={(_, page) => setFilters(prev => ({ ...prev, page }))}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={selected.length === 0 || addMutation.isPending}
          startIcon={addMutation.isPending && <CircularProgress size={20} color="inherit" />}
        >
          Thêm {selected.length > 0 ? `(${selected.length})` : ''} thí sinh
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminatedContestantDialog;