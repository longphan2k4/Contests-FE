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
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import type { Round } from '../../types';

interface RoundListProps {
  contestId: number;
  onAddRound?: () => void;
  onEditRound?: (roundId: number) => void;
  onDeleteRound?: (roundId: number) => void;
}

const RoundList: React.FC<RoundListProps> = ({
  contestId,
  onAddRound,
  onEditRound,
  onDeleteRound
}) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tạm thời sử dụng dữ liệu mẫu
    // Sau này sẽ thay thế bằng API call thực tế
    const fetchRounds = async () => {
      try {
        setLoading(true);
        // Giả lập API call
        setTimeout(() => {
          const sampleRounds: Round[] = [
            {
              id: 1,
              contestId: contestId,
              name: 'Vòng sơ loại',
              description: 'Vòng sơ loại để chọn ra các thí sinh xuất sắc nhất',
              startTime: '2023-10-01T08:00:00Z',
              endTime: '2023-10-01T12:00:00Z',
              status: 'completed',
              order: 1,
              isElimination: true,
              createdAt: '2023-09-15T00:00:00Z',
              updatedAt: '2023-09-15T00:00:00Z'
            },
            {
              id: 2,
              contestId: contestId,
              name: 'Vòng chung kết',
              description: 'Vòng chung kết để xác định người chiến thắng',
              startTime: '2023-10-15T08:00:00Z',
              endTime: '2023-10-15T17:00:00Z',
              status: 'upcoming',
              order: 2,
              isElimination: false,
              createdAt: '2023-09-15T00:00:00Z',
              updatedAt: '2023-09-15T00:00:00Z'
            }
          ];
          setRounds(sampleRounds);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching rounds:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách vòng đấu');
        setLoading(false);
      }
    };

    fetchRounds();
  }, [contestId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
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
        <Typography variant="h6">Danh sách vòng đấu</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddRound}
        >
          Thêm vòng đấu
        </Button>
      </Box>

      {rounds.length === 0 ? (
        <Alert severity="info">Chưa có vòng đấu nào được tạo</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên vòng đấu</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Loại vòng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rounds.map((round) => (
                <TableRow key={round.id}>
                  <TableCell>{round.order}</TableCell>
                  <TableCell>{round.name}</TableCell>
                  <TableCell>
                    {format(new Date(round.startTime), 'dd/MM/yyyy HH:mm')} - 
                    {format(new Date(round.endTime), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(round.status)}
                      color={getStatusColor(round.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {round.isElimination ? 'Vòng loại' : 'Vòng chính thức'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEditRound && onEditRound(round.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteRound && onDeleteRound(round.id)}
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

export default RoundList; 