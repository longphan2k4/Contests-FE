
import React, { memo } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
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
const chartData = [
  { title: "Thống kê số SV theo lớp", data: [120, 90, 75, 140] },
  { title: "Số SV theo môn", data: [80, 95, 110, 130] },
  { title: "Số SV theo khóa", data: [70, 100, 85, 120] },
  { title: "Số SV theo ngành", data: [150, 100, 90, 110] },
  { title: "Số SV theo giới tính", data: [600, 600] },
  { title: "Số SV theo năm", data: [300, 400, 500] },
];

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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard Thống Kê
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap={3}
        >
        {stats.map((item, index) => (
            <Box key={index}>
            <StatCard {...item} />
            </Box>
        ))}
        </Box>
             <Box mt={5}>
        <Grid container spacing={3}>
            {chartData.map((chart, index) => (
                <Grid item xs={12} sm={6} key={index}>
                <Typography variant="h6" gutterBottom>{chart.title}</Typography>
                <BarChart
                    height={300}
                    series={[{ data: chart.data, label: "Số SV" }]}
                    xAxis={[{
                    data: chart.data.map((_, i) => `Nhóm ${i + 1}`),
                    scaleType: "band",
                    }]}
                />
                </Grid>
            ))}
            </Grid>

      </Box>
    </Box>
            
  );
};

export default memo(Dashboard);
