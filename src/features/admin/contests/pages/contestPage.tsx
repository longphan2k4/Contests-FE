import React, { useEffect, useState } from 'react';
import ContestCard from '../components/contestsCard';
import { getContests } from '../services/contestsService';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Stack, 
  TextField, 
  InputAdornment, 
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Contest } from '../types';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CreateContestDialog from '../components/CreateContestDialog';
import { useToast } from '../../../../contexts/toastContext';
import EditContestDialog from '../components/EditContestDialog';
import Confirm from '../../../../components/Confirm';
import { useContests } from '../hooks/useContests';
import DeleteIcon from '@mui/icons-material/Delete';

const ContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedContests, setSelectedContests] = useState<number[]>([]);
  const [deleteManyLoading, setDeleteManyLoading] = useState(false);

  const { removeContest, removeManyContests } = useContests();
  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await getContests({
        page,
        limit,
        search: searchTerm
      });
      if (response.success && response.data?.Contest) {
        setContests(response.data.Contest);
        setTotal(response.data.pagination?.total || 0);
      } else {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách cuộc thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, [page, limit, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset về trang 1 khi thay đổi số lượng hiển thị
  };
  
  const handleAddContest = () => {
    setCreateDialogOpen(true);
  };
  
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleContestCreated = () => {
    fetchContests();
    showToast('Tạo mới cuộc thi thành công', 'success');
  };
  
  const handleViewContest = (contestId: number) => {
    navigate(`/admin/contests/${contestId}`);
  };

  const handleEditContest = (contestId: number) => {
    const contest = contests.find(c => c.id === contestId);
    if (contest) {
      setSelectedContest(contest);
      setEditDialogOpen(true);
    }

  };
  const handleDeleteContest = (contestId: number) => {
    setDeletingId(contestId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await removeContest(deletingId); // Nếu lỗi sẽ nhảy vào catch
      showToast('Xoá cuộc thi thành công', 'success');
       fetchContests();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Xoá thất bại', 'error');
    } finally {
      setDeleteLoading(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedContest(null);
  };

  const handleContestUpdated = (updatedContest: Contest) => {
    setContests(prevContests => 
      prevContests.map(contest => 
        contest.id === updatedContest.id ? updatedContest : contest
      )
    );
    fetchContests();
    showToast('Cập nhật cuộc thi thành công', 'success');
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSelectContest = (contestId: number) => {
    setSelectedContests(prev => {
      if (prev.includes(contestId)) {
        return prev.filter(id => id !== contestId);
      }
      return [...prev, contestId];
    });
  };

  const handleSelectAll = () => {
    if (selectedContests.length === contests.length) {
      setSelectedContests([]);
    } else {
      setSelectedContests(contests.map(contest => contest.id));
    }
  };

  const handleDeleteMany = async () => {
    if (selectedContests.length === 0) return;
    setDeleteManyLoading(true);
    try {
        const response = await removeManyContests(selectedContests);
        if (response.success) {
            // Hiển thị thông báo cho các cuộc thi xóa thành công
            if (response.successfulDeletes.length > 0) {
                showToast(`Đã xóa thành công ${response.successfulDeletes.length} cuộc thi`, 'success');
            }
            
            // Hiển thị thông báo cho các cuộc thi không thể xóa
            response.failedDeletes.forEach(deleteInfo => {
                showToast(deleteInfo.msg, 'error');
            });

            setSelectedContests([]);
            fetchContests();
        }
    } catch (error) {
        showToast(error instanceof Error ? error.message : 'Xóa thất bại', 'error');
    } finally {
        setDeleteManyLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h4" gutterBottom sx={{ mb: { xs: 2, sm: 0 } }}>
          Danh sách cuộc thi
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddContest}
          fullWidth={false}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            alignSelf: { xs: 'stretch', sm: 'flex-end' }
          }}
        >
          Thêm cuộc thi
        </Button>
      </Box>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <TextField
            sx={{ 
              width: { xs: '100%', sm: '20%' },
              minWidth: { sm: '200px' }
            }}
            size="small"
            label="Tìm kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {contests.length > 0 && (
            <Button
              size="small"
              onClick={handleSelectAll}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                whiteSpace: 'nowrap'
              }}
            >
              {selectedContests.length === contests.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Button>
          )}
                  {/* Toolbar khi có item được chọn */}
        {selectedContests.length > 0 && (
          <Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteMany}
              disabled={deleteManyLoading}
              sx={{ 
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Xóa đã chọn ({selectedContests.length})
            </Button>
          </Box>
        )}

        </Box>

      </Stack>

      {contests.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Không có dữ liệu
        </Typography>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }, 
            gap: 3 
          }}>
            {contests.map((contest) => (
              <Box key={contest.id}>
                <ContestCard 
                  contestId={contest.id} 
                  onView={handleViewContest}
                  onEdit={handleEditContest}
                  onDelete={handleDeleteContest}
                  selected={selectedContests.includes(contest.id)}
                  onSelect={() => handleSelectContest(contest.id)}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: { xs: '100%', sm: 100 },
                order: { xs: 2, sm: 1 }
              }}
            >
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(limit)}
                onChange={handleLimitChange}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ 
              order: { xs: 1, sm: 2 },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              Trang {page} / {totalPages}
            </Typography>
          </Box>

          {totalPages > 0 && (
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              justifyContent: 'center',
              '& .MuiPagination-ul': {
                flexWrap: 'wrap',
                justifyContent: 'center'
              },
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: '32px', sm: '40px' },
                height: { xs: '32px', sm: '40px' }
              }
            }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                showFirstButton 
                showLastButton  
                color="primary"
                size="medium"
              />
            </Box>
          )}
        </>
      )}
      
      {/* Dialog thêm cuộc thi mới */}
      <CreateContestDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreated={handleContestCreated}
      />

      {/* Dialog chỉnh sửa cuộc thi */}
      {selectedContest && (
        <EditContestDialog
          contest={selectedContest}
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          onUpdated={handleContestUpdated}
        />
      )}
      {/* Dialog xác nhận xoá */}
      <Confirm
        open={confirmOpen}
        title="Xác nhận xoá cuộc thi"
        description="Bạn có chắc chắn muốn xoá cuộc thi này không?"
        loading={deleteLoading}
        onClose={() => { setConfirmOpen(false); setDeletingId(null); }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default ContestPage;