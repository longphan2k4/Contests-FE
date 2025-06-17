import React, { useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  Rating,
  LinearProgress,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { Result } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ResultsTableProps {
  results: Result[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  // Nhóm kết quả theo thí sinh và tính điểm
  const contestantScores = useMemo(() => {
    const scoreMap: Record<number, { correct: number, total: number, accuracy: number }> = {};
    
    results.forEach(result => {
      if (!scoreMap[result.contestantId]) {
        scoreMap[result.contestantId] = { correct: 0, total: 0, accuracy: 0 };
      }
      
      scoreMap[result.contestantId].total += 1;
      if (result.isCorrect) {
        scoreMap[result.contestantId].correct += 1;
      }
    });
    
    // Tính tỉ lệ chính xác
    Object.keys(scoreMap).forEach(id => {
      const contestantId = Number(id);
      const { correct, total } = scoreMap[contestantId];
      scoreMap[contestantId].accuracy = total > 0 ? (correct / total) * 100 : 0;
    });
    
    // Sắp xếp theo số câu đúng giảm dần
    return Object.entries(scoreMap)
      .map(([id, stats]) => ({ 
        contestantId: Number(id), 
        ...stats 
      }))
      .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy);
  }, [results]);
  
  if (results.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Không có dữ liệu kết quả
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Hiển thị bảng xếp hạng
  const renderRankingTable = () => (
    <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'white' }}>
        <Typography variant="h6">
          <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Bảng xếp hạng thí sinh
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Xếp hạng</TableCell>
              <TableCell>Thí sinh ID</TableCell>
              <TableCell>Số câu đúng</TableCell>
              <TableCell>Tổng số câu</TableCell>
              <TableCell>Tỉ lệ chính xác</TableCell>
              <TableCell>Đánh giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestantScores.map((contestant, index) => (
              <TableRow 
                key={contestant.contestantId}
                sx={{ 
                  bgcolor: index === 0 ? 'gold.light' : index === 1 ? 'silver.light' : index === 2 ? 'bronze.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {index === 0 ? (
                      <Tooltip title="Hạng nhất">
                        <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1 }} />
                      </Tooltip>
                    ) : index === 1 ? (
                      <Tooltip title="Hạng nhì">
                        <EmojiEventsIcon sx={{ color: '#C0C0C0', mr: 1 }} />
                      </Tooltip>
                    ) : index === 2 ? (
                      <Tooltip title="Hạng ba">
                        <EmojiEventsIcon sx={{ color: '#CD7F32', mr: 1 }} />
                      </Tooltip>
                    ) : (
                      index + 1
                    )}
                  </Box>
                </TableCell>
                <TableCell><strong>{contestant.contestantId}</strong></TableCell>
                <TableCell>{contestant.correct}</TableCell>
                <TableCell>{contestant.total}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={contestant.accuracy} 
                        color={contestant.accuracy > 70 ? "success" : contestant.accuracy > 40 ? "warning" : "error"}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {contestant.accuracy.toFixed(1)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating 
                    value={Math.ceil(contestant.accuracy / 20)} 
                    readOnly 
                    max={5}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // Hiển thị bảng chi tiết kết quả
  const renderDetailsTable = () => (
    <Paper elevation={2}>
      <Box sx={{ bgcolor: 'primary.light', p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Chi tiết kết quả
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Câu hỏi</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell align="center">Kết quả</TableCell>
              <TableCell>Thí sinh ID</TableCell>
              <TableCell>Trận đấu ID</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  bgcolor: row.isCorrect ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.questionOrder}</TableCell>
                <TableCell align="center">
                  {row.isCorrect ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Đúng"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Sai"
                      color="error"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </TableCell>
                <TableCell>{row.contestantId}</TableCell>
                <TableCell>{row.matchId}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <>
      {renderRankingTable()}
      {renderDetailsTable()}
    </>
  );
};

export default ResultsTable; 