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
  CircularProgress,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import type { Result, Round } from '../../types';

interface ResultListProps {
  contestId: number;
  onEditResult?: (resultId: number) => void;
  onViewResultDetail?: (resultId: number) => void;
  onExportResults?: (roundId: number) => void;
}

const ResultList: React.FC<ResultListProps> = ({
  contestId,
  onEditResult,
  onViewResultDetail,
  onExportResults
}) => {
  const [results, setResults] = useState<Result[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tạm thời sử dụng dữ liệu mẫu
    // Sau này sẽ thay thế bằng API call thực tế
    const fetchRounds = async () => {
      try {
        // Giả lập API call
        setTimeout(() => {
          const sampleRounds: Round[] = [
            {
              id: 1,
              contestId: contestId,
              name: 'Vòng sơ loại',
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
          if (sampleRounds.length > 0) {
            setSelectedRoundId(sampleRounds[0].id);
          }
        }, 500);
      } catch (error) {
        console.error('Error fetching rounds:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách vòng đấu');
      }
    };

    fetchRounds();
  }, [contestId]);

  useEffect(() => {
    if (selectedRoundId === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        // Giả lập API call
        setTimeout(() => {
          const sampleResults: Result[] = [
            {
              id: 1,
              contestId: contestId,
              roundId: Number(selectedRoundId),
              contestantId: 1,
              score: 85,
              rank: 2,
              feedback: 'Bài làm tốt, cần cải thiện phần trình bày',
              submittedAt: '2023-10-01T11:30:00Z',
              judgeName: 'Giám khảo A',
              createdAt: '2023-10-01T12:00:00Z',
              updatedAt: '2023-10-01T12:00:00Z'
            },
            {
              id: 2,
              contestId: contestId,
              roundId: Number(selectedRoundId),
              contestantId: 2,
              score: 92,
              rank: 1,
              feedback: 'Xuất sắc, đáp ứng đầy đủ yêu cầu',
              submittedAt: '2023-10-01T11:45:00Z',
              judgeName: 'Giám khảo B',
              createdAt: '2023-10-01T12:00:00Z',
              updatedAt: '2023-10-01T12:00:00Z'
            },
            {
              id: 3,
              contestId: contestId,
              roundId: Number(selectedRoundId),
              contestantId: 3,
              score: 78,
              rank: 3,
              feedback: 'Cần cải thiện phần kỹ thuật',
              submittedAt: '2023-10-01T11:50:00Z',
              judgeName: 'Giám khảo A',
              createdAt: '2023-10-01T12:00:00Z',
              updatedAt: '2023-10-01T12:00:00Z'
            }
          ];
          setResults(sampleResults);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải kết quả');
        setLoading(false);
      }
    };

    fetchResults();
  }, [contestId, selectedRoundId]);

  const handleRoundChange = (event: SelectChangeEvent<number | string>) => {
    setSelectedRoundId(event.target.value as number);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Kết quả cuộc thi</Typography>
        {selectedRoundId && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => onExportResults && onExportResults(Number(selectedRoundId))}
          >
            Xuất kết quả
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="round-select-label">Chọn vòng đấu</InputLabel>
          <Select
            labelId="round-select-label"
            id="round-select"
            value={selectedRoundId}
            label="Chọn vòng đấu"
            onChange={handleRoundChange}
          >
            {rounds.map((round) => (
              <MenuItem key={round.id} value={round.id}>
                {round.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : results.length === 0 ? (
        <Alert severity="info">Chưa có kết quả nào cho vòng đấu này</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thứ hạng</TableCell>
                <TableCell>ID thí sinh</TableCell>
                <TableCell>Điểm số</TableCell>
                <TableCell>Thời gian nộp</TableCell>
                <TableCell>Người chấm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results
                .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                .map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight={result.rank === 1 ? 'bold' : 'normal'}
                      color={result.rank === 1 ? 'primary' : 'inherit'}
                    >
                      {result.rank || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{result.contestantId}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>{new Date(result.submittedAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>{result.judgeName || '-'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => onViewResultDetail && onViewResultDetail(result.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEditResult && onEditResult(result.id)}
                      >
                        <EditIcon fontSize="small" />
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

export default ResultList; 