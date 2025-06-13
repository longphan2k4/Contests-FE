import React, { useEffect, useState } from 'react';
import ContestCard from '../components/contestsCard';
import { getContests } from '../services/contestsService';
import { Box, Typography, CircularProgress, Alert, Stack, TextField, InputAdornment, Button } from '@mui/material';
import type { Contest } from '../types';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CreateContestDialog from '../components/CreateContestDialog';
import { useToast } from '../../../../contexts/toastContext';
import EditContestDialog from '../components/EditContestDialog';

const ContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const { showToast } = useToast();

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await getContests();
      if (response.success && response.data?.Contest) {
        setContests(response.data.Contest);
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
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
    showToast('Cập nhật cuộc thi thành công', 'success');
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
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {contests.map((contest) => (
          <Box key={contest.id} >
            <ContestCard 
              contestId={contest.id} 
              onShare={() => console.log('Share contest:', contest.id)}
              onView={handleViewContest}
              onEdit={handleEditContest}
            />
          </Box>
        ))}
      </Box>
      
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
    </Box>
  );
};

export default ContestPage;