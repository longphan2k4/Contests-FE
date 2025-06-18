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
  LinearProgress,
  Tooltip,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import type { Result } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ResultsTableProps {
  results: Result[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  // Nhóm kết quả theo thí sinh và tính điểm
  const contestantScores = useMemo(() => {
    const scoreMap: Record<string, { 
      contestant: Result['contestant'];
      correct: number; 
      total: number; 
      accuracy: number;
      matches: Set<string>;
    }> = {};
    
    results.forEach(result => {
      const key = result.contestant.student.id.toString();
      if (!scoreMap[key]) {
        scoreMap[key] = { 
          contestant: result.contestant,
          correct: 0, 
          total: 0, 
          accuracy: 0,
          matches: new Set()
        };
      }
      
      scoreMap[key].total += 1;
      scoreMap[key].matches.add(result.match.name);
      if (result.isCorrect) {
        scoreMap[key].correct += 1;
      }
    });
    
    // Tính tỉ lệ chính xác
    Object.keys(scoreMap).forEach(key => {
      const { correct, total } = scoreMap[key];
      scoreMap[key].accuracy = total > 0 ? (correct / total) * 100 : 0;
    });
    
    // Sắp xếp theo số câu đúng giảm dần
    return Object.entries(scoreMap)
      .map(([key, stats]) => ({ 
        studentId: key,
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

  // Lấy màu cho chip result
  const getResultChipProps = (isCorrect: boolean) => ({
    icon: isCorrect ? <CheckCircleIcon /> : <CancelIcon />,
    label: isCorrect ? 'Đúng' : 'Sai',
    color: isCorrect ? 'success' as const : 'error' as const,
    variant: 'filled' as const
  });

  // Hiển thị bảng xếp hạng
  const renderRankingTable = () => (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            Bảng xếp hạng thí sinh
          </Typography>
        </Box>
      </CardContent>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell><strong>Hạng</strong></TableCell>
              <TableCell><strong>Thí sinh</strong></TableCell>
              <TableCell><strong>Mã SV</strong></TableCell>
              <TableCell align="center"><strong>Số câu đúng</strong></TableCell>
              <TableCell align="center"><strong>Tổng câu</strong></TableCell>
              <TableCell><strong>Tỉ lệ chính xác</strong></TableCell>
              <TableCell align="center"><strong>Số trận</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestantScores.map((contestant, index) => (
              <TableRow 
                key={contestant.studentId}
                sx={{ 
                  bgcolor: index < 3 ? `rgba(255, 215, 0, ${0.1 - index * 0.02})` : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {index === 0 && (
                      <Tooltip title="Hạng nhất">
                        <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1 }} />
                      </Tooltip>
                    )}
                    {index === 1 && (
                      <Tooltip title="Hạng nhì">
                        <EmojiEventsIcon sx={{ color: '#C0C0C0', mr: 1 }} />
                      </Tooltip>
                    )}
                    {index === 2 && (
                      <Tooltip title="Hạng ba">
                        <EmojiEventsIcon sx={{ color: '#CD7F32', mr: 1 }} />
                      </Tooltip>
                    )}
                    <Typography variant="h6" color={index < 3 ? 'primary' : 'inherit'}>
                      {index + 1}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {contestant.contestant.student.fullName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<SchoolIcon />}
                    label={contestant.contestant.student.studentCode}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" color="success.main">
                    {contestant.correct}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1">
                    {contestant.total}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={contestant.accuracy} 
                        color={contestant.accuracy > 70 ? "success" : contestant.accuracy > 40 ? "warning" : "error"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 45 }}>
                      {contestant.accuracy.toFixed(1)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={contestant.matches.size}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  // Hiển thị bảng chi tiết kết quả
  const renderDetailsTable = () => (
    <Card elevation={2}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SportsEsportsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            Chi tiết kết quả
          </Typography>
        </Box>
      </CardContent>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell><strong>STT</strong></TableCell>
              <TableCell><strong>Câu hỏi</strong></TableCell>
              <TableCell><strong>Thí sinh</strong></TableCell>
              <TableCell><strong>Trận đấu</strong></TableCell>
              <TableCell><strong>Vòng</strong></TableCell>
              <TableCell align="center"><strong>Thứ tự</strong></TableCell>
              <TableCell align="center"><strong>Kết quả</strong></TableCell>
              <TableCell><strong>Thời gian</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {row.contestant.student.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.contestant.student.studentCode}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.match.name}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.match.round.name}
                    variant="filled"
                    size="small"
                    color="secondary"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.questionOrder}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip {...getResultChipProps(row.isCorrect)} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(row.createdAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {renderRankingTable()}
      {renderDetailsTable()}
    </Box>
  );
};

export default ResultsTable; 