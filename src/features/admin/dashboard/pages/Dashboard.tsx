// Dashboard.tsx
import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import ClassIcon from '@mui/icons-material/Class';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { BarChart } from '@mui/x-charts';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
    <Box sx={{ mr: 2, color, fontSize: 40 }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Trường học', value: 12, icon: <SchoolIcon />, color: "#1976d2" },
    { title: 'Lớp học', value: 45, icon: <ClassIcon />, color: "#9c27b0" },
    { title: 'Người dùng', value: 230, icon: <GroupIcon />, color: "#4caf50" },
    { title: 'Câu hỏi', value: 890, icon: <QuestionAnswerIcon />, color: "#ff9800" },
    { title: 'Gói câu hỏi', value: 15, icon: <QuizIcon />, color: "#3f51b5" },
    { title: 'Cuộc thi', value: 8, icon: <EmojiEventsIcon />, color: "#f44336" },
    { title: 'Sinh viên', value: 1200, icon: <PeopleAltIcon />, color: "#00bcd4" },
  ];

  const studentByClassData = [
    { id: 0, value: 120, label: '12A1' },
    { id: 1, value: 90, label: '12A2' },
    { id: 2, value: 75, label: '11B1' },
    { id: 3, value: 140, label: '11B2' },
  ];

  
  const userRole = [
    { id: 0, value: 150, label: 'Admin' },
    { id: 1, value: 100, label: 'Trọng tài' },
  ];

  const topicQuestionData = [
    { id: 0, value: 150, label: 'Toán' },
    { id: 1, value: 100, label: 'Lịch sử' },
    { id: 2, value: 120, label: 'Anh' },
    { id: 3, value: 80, label: 'Khoa học' },
  ];

  const contestsByYear = [
    { id: 0, value: 3, label: '2022' },
    { id: 1, value: 5, label: '2023' },
    { id: 2, value: 7, label: '2024' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard Thống Kê
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap={3}>
        {stats.map((item, index) => (
          <Box key={index}>
            <StatCard {...item} />
          </Box>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3} mt={5}>
        <Box>
          <Typography variant="h6" gutterBottom>SV theo lớp</Typography>
          <BarChart
            height={300}
            series={[{ data: studentByClassData.map(d => d.value), label: 'Số SV' }]}
            xAxis={[{ data: studentByClassData.map(d => d.label), scaleType: 'band' }]}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Câu hỏi theo chuyên đề</Typography>
          <BarChart
            height={300}
            series={[{ data: topicQuestionData.map(d => d.value), label: 'Số câu hỏi' }]}
            xAxis={[{ data: topicQuestionData.map(d => d.label), scaleType: 'band' }]}
          />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>Số người dùng theo role</Typography>
          <BarChart
            height={300}
            series={[{ data: userRole.map(d => d.value), label: 'Số người dùng' }]}
            xAxis={[{ data: userRole.map(d => d.label), scaleType: 'band' }]}
          />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>Cuộc thi theo năm</Typography>
          <BarChart
            height={300}
            series={[{ data: contestsByYear.map(d => d.value), label: 'Số cuộc thi' }]}
            xAxis={[{ data: contestsByYear.map(d => d.label), scaleType: 'band' }]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Dashboard);
