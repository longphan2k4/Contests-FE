import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import type { Contestant } from '../../types';

interface ContestantListProps {
  contestId: number;
  onAddContestant?: () => void;
  onEditContestant?: (contestantId: number) => void;
  onDeleteContestant?: (contestantId: number) => void;
}

const ContestantList: React.FC<ContestantListProps> = ({
  contestId,
  onAddContestant,
  onEditContestant,
  onDeleteContestant
}) => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Tạm thời sử dụng dữ liệu mẫu
    // Sau này sẽ thay thế bằng API call thực tế
    const fetchContestants = async () => {
      try {
        setLoading(true);
        // Giả lập API call
        setTimeout(() => {
          const sampleContestants: Contestant[] = [
            {
              id: 1,
              contestId: contestId,
              fullName: 'Nguyễn Văn A',
              email: 'nguyenvana@example.com',
              phone: '0901234567',
              dateOfBirth: '1995-05-15',
              gender: 'male',
              organization: 'Đại học Bách Khoa Hà Nội',
              registrationTime: '2023-09-10T08:30:00Z',
              status: 'approved',
              createdAt: '2023-09-10T08:30:00Z',
              updatedAt: '2023-09-10T08:30:00Z'
            },
            {
              id: 2,
              contestId: contestId,
              fullName: 'Trần Thị B',
              email: 'tranthib@example.com',
              phone: '0909876543',
              dateOfBirth: '1998-12-20',
              gender: 'female',
              organization: 'Đại học Quốc Gia Hà Nội',
              registrationTime: '2023-09-11T10:15:00Z',
              status: 'pending',
              createdAt: '2023-09-11T10:15:00Z',
              updatedAt: '2023-09-11T10:15:00Z'
            },
            {
              id: 3,
              contestId: contestId,
              fullName: 'Lê Văn C',
              email: 'levanc@example.com',
              phone: '0912345678',
              dateOfBirth: '1997-03-25',
              gender: 'male',
              organization: 'Đại học FPT',
              registrationTime: '2023-09-12T14:20:00Z',
              status: 'approved',
              createdAt: '2023-09-12T14:20:00Z',
              updatedAt: '2023-09-12T14:20:00Z'
            }
          ];
          setContestants(sampleContestants);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching contestants:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách thí sinh');
        setLoading(false);
      }
    };

    fetchContestants();
  }, [contestId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredContestants = contestants.filter(contestant =>
    contestant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contestant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contestant.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Đang chờ';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
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
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Danh sách thí sinh</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddContestant}
        >
          Thêm thí sinh
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm theo tên, email, tổ chức..."
          variant="outlined"
          fullWidth
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
      </Box>

      {filteredContestants.length === 0 ? (
        <Alert severity="info">Không tìm thấy thí sinh nào</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tổ chức</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContestants.map((contestant) => (
                <TableRow key={contestant.id}>
                  <TableCell>{contestant.id}</TableCell>
                  <TableCell>{contestant.fullName}</TableCell>
                  <TableCell>{contestant.email}</TableCell>
                  <TableCell>{contestant.organization || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(contestant.status)}
                      color={getStatusColor(contestant.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEditContestant && onEditContestant(contestant.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteContestant && onDeleteContestant(contestant.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ContestantList; 