import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  useTheme,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useQuestionDetailStats } from '../hooks/useQuestionDetailStats';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

interface QuestionDetailStatsProps {
  packageId?: number;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              backgroundColor: alpha(color, 0.1),
              borderRadius: '50%',
              p: 1,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color }}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const QuestionDetailStats: React.FC<QuestionDetailStatsProps> = ({ 
  packageId, 
  timeRange = 'month' 
}) => {
  const theme = useTheme();
  const { stats, loading, error, filter, updateFilter } = useQuestionDetailStats(packageId, timeRange);

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    updateFilter({ timeRange: event.target.value as 'day' | 'week' | 'month' | 'year' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Đang tải dữ liệu thống kê...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Không có dữ liệu thống kê</Typography>
      </Box>
    );
  }

  const statusChartData = [
    { name: 'Đang hoạt động', value: stats?.overview?.activeQuestionDetails || 0 },
    { name: 'Không hoạt động', value: stats?.overview?.inactiveQuestionDetails || 0 }
  ];

  const packageChartData = (stats?.packageStats || []).slice(0, 5).map(pkg => ({
    name: pkg.packageName,
    active: pkg.activeQuestions,
    inactive: pkg.inactiveQuestions
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header với bộ lọc */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          p: 2,
          borderRadius: 1,
          boxShadow: theme.shadows[1]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Thống kê chi tiết câu hỏi
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoảng thời gian</InputLabel>
          <Select
            value={filter?.timeRange || 'month'}
            label="Khoảng thời gian"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="day">Hôm nay</MenuItem>
            <MenuItem value="week">Tuần này</MenuItem>
            <MenuItem value="month">Tháng này</MenuItem>
            <MenuItem value="year">Năm nay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tổng quan */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        <StatCard
          title="Tổng số chi tiết câu hỏi"
          value={stats?.overview?.totalQuestionDetails || 0}
          icon={<TimelineIcon sx={{ color: theme.palette.primary.main }} />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Câu hỏi đang hoạt động"
          value={stats?.overview?.activeQuestionDetails || 0}
          icon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
          color={theme.palette.success.main}
        />
        <StatCard
          title="Câu hỏi không hoạt động"
          value={stats?.overview?.inactiveQuestionDetails || 0}
          icon={<CancelIcon sx={{ color: theme.palette.error.main }} />}
          color={theme.palette.error.main}
        />
        <StatCard
          title="Số gói câu hỏi"
          value={stats?.overview?.totalPackages || 0}
          icon={<AssessmentIcon sx={{ color: theme.palette.info.main }} />}
          color={theme.palette.info.main}
        />
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 3
        }}
      >
        {/* Biểu đồ tròn trạng thái */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Trạng thái câu hỏi
          </Typography>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Biểu đồ cột top gói câu hỏi */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Top 5 gói câu hỏi
          </Typography>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="active" 
                  name="Đang hoạt động" 
                  fill={theme.palette.primary.main} 
                />
                <Bar 
                  dataKey="inactive" 
                  name="Không hoạt động" 
                  fill={theme.palette.error.main} 
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default QuestionDetailStats; 