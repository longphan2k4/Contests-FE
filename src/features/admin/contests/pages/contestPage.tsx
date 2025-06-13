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

  const { removeContest } = useContests();
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
     const response = await removeContest(deletingId); // Nếu lỗi sẽ nhảy vào catch
      console.log('page ', response);
      showToast('Xoá cuộc thi thành công', 'success');
       fetchContests();
    } catch (error) {
      console.log('page lỗi ', error);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách cuộc thi
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{float: 'right'}}
        startIcon={<AddIcon />}
        onClick={handleAddContest}
      >
        Thêm cuộc thi
      </Button>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          sx={{ width: '20%' }}
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
      </Stack>

      {contests.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Không có dữ liệu
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
            {contests.map((contest) => (
              <Box key={contest.id}>
                <ContestCard 
                  contestId={contest.id} 
                  onView={handleViewContest}
                  onEdit={handleEditContest}
                  onDelete={handleDeleteContest}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
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