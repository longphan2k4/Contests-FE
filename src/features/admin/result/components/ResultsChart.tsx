import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  Area, AreaChart, ComposedChart
} from 'recharts';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import type { ResultSummary } from '../types';
import type { Result } from '../types';

interface ResultsChartProps {
  summary: ResultSummary;
  results: Result[];
}

const COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0'];

const ResultsChart: React.FC<ResultsChartProps> = ({ summary, results }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const pieData = [
    { name: 'Đáp án đúng', value: summary.correctAnswers },
    { name: 'Đáp án sai', value: summary.incorrectAnswers }
  ];

  // Dữ liệu cho biểu đồ theo thí sinh
  const contestantData = useMemo(() => {
    const contestantMap: Record<number, { correct: number; incorrect: number; total: number }> = {};
    
    results.forEach(result => {
      if (!contestantMap[result.contestantId]) {
        contestantMap[result.contestantId] = { correct: 0, incorrect: 0, total: 0 };
      }
      
      contestantMap[result.contestantId].total += 1;
      if (result.isCorrect) {
        contestantMap[result.contestantId].correct += 1;
      } else {
        contestantMap[result.contestantId].incorrect += 1;
      }
    });
    
    return Object.entries(contestantMap).map(([id, data]) => ({
      contestantId: Number(id),
      correct: data.correct,
      incorrect: data.incorrect,
      total: data.total,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0
    })).sort((a, b) => a.contestantId - b.contestantId);
  }, [results]);

  // Dữ liệu cho biểu đồ theo thứ tự câu hỏi
  const questionOrderData = useMemo(() => {
    const orderMap: Record<number, { correct: number; incorrect: number; total: number }> = {};
    
    results.forEach(result => {
      if (!orderMap[result.questionOrder]) {
        orderMap[result.questionOrder] = { correct: 0, incorrect: 0, total: 0 };
      }
      
      orderMap[result.questionOrder].total += 1;
      if (result.isCorrect) {
        orderMap[result.questionOrder].correct += 1;
      } else {
        orderMap[result.questionOrder].incorrect += 1;
      }
    });
    
    return Object.entries(orderMap).map(([order, data]) => ({
      questionOrder: Number(order),
      correct: data.correct,
      incorrect: data.incorrect,
      total: data.total,
      correctRate: data.total > 0 ? (data.correct / data.total) * 100 : 0
    })).sort((a, b) => a.questionOrder - b.questionOrder);
  }, [results]);

  // Biểu đồ tròn
  const renderPieChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} câu`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  // Biểu đồ cột theo thí sinh
  const renderContestantBarChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={contestantData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="contestantId" label={{ value: 'Thí sinh ID', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Số câu trả lời', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="correct" name="Đáp án đúng" fill="#4caf50" stackId="a" />
          <Bar dataKey="incorrect" name="Đáp án sai" fill="#f44336" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  // Biểu đồ đường theo thứ tự câu hỏi
  const renderQuestionLineChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={questionOrderData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="questionOrder" label={{ value: 'Thứ tự câu hỏi', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Tỉ lệ đúng (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
          <Legend />
          <Line type="monotone" dataKey="correctRate" name="Tỉ lệ đúng" stroke="#2196f3" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  // Biểu đồ kết hợp
  const renderComposedChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={questionOrderData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="questionOrder" label={{ value: 'Thứ tự câu hỏi', position: 'insideBottom', offset: -5 }} />
          <YAxis yAxisId="left" label={{ value: 'Số câu trả lời', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Tỉ lệ đúng (%)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="total" name="Tổng số câu" fill="#ff9800" />
          <Bar yAxisId="left" dataKey="correct" name="Số câu đúng" fill="#4caf50" />
          <Line yAxisId="right" type="monotone" dataKey="correctRate" name="Tỉ lệ đúng" stroke="#2196f3" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );

  // Biểu đồ vùng
  const renderAreaChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={contestantData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="contestantId" label={{ value: 'Thí sinh ID', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Tỉ lệ chính xác (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
          <Legend />
          <Area type="monotone" dataKey="accuracy" name="Tỉ lệ chính xác" stroke="#9c27b0" fill="#9c27b0" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Thống kê kết quả
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Tổng quan" />
        <Tab label="Biểu đồ cột" />
        <Tab label="Biểu đồ đường" />
        <Tab label="Biểu đồ kết hợp" />
        <Tab label="Biểu đồ vùng" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ 
            width: { xs: '100%', md: '50%' }, 
            height: 300, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            {renderPieChart()}
          </Box>
          
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 3
          }}>
            <Typography variant="body1">
              Tổng số câu hỏi: <strong>{summary.totalQuestions}</strong>
            </Typography>
            <Typography variant="body1" color="success.main">
              Đáp án đúng: <strong>{summary.correctAnswers}</strong>
            </Typography>
            <Typography variant="body1" color="error.main">
              Đáp án sai: <strong>{summary.incorrectAnswers}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Tỷ lệ chính xác: <strong>{summary.accuracy.toFixed(2)}%</strong>
            </Typography>
          </Box>
        </Box>
      )}

      {activeTab === 1 && renderContestantBarChart()}
      {activeTab === 2 && renderQuestionLineChart()}
      {activeTab === 3 && renderComposedChart()}
      {activeTab === 4 && renderAreaChart()}
    </Paper>
  );
};

export default ResultsChart; 