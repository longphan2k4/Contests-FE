import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { BarChart } from "@mui/x-charts";

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

const Dashboard = () => {
  const stats = [
    { title: "Vòng thi", value: 5, icon: <EmojiEventsIcon />, color: "#f44336" },
    { title: "Nhóm thi", value: 8, icon: <GroupIcon />, color: "#3f51b5" },
    { title: "Thí sinh", value: 120, icon: <PeopleAltIcon />, color: "#00bcd4" },
    { title: "Trận đấu", value: 24, icon: <QuizIcon />, color: "#9c27b0" },
    { title: "Kết quả đã công bố", value: 18, icon: <CheckCircleIcon />, color: "#4caf50" },
    { title: "Tài trợ", value: 4, icon: <AttachMoneyIcon />, color: "#ff9800" },
    { title: "Giải thưởng", value: 6, icon: <CardGiftcardIcon />, color: "#1976d2" },
  ];

  const contestantsByGroup = [
    { label: "Nhóm A", value: 30 },
    { label: "Nhóm B", value: 25 },
    { label: "Nhóm C", value: 40 },
    { label: "Nhóm D", value: 25 },
  ];

  const matchesByRound = [
    { label: "Vòng 1", value: 8 },
    { label: "Vòng 2", value: 6 },
    { label: "Vòng 3", value: 6 },
    { label: "Chung kết", value: 4 },
  ];

  const awardsByRank = [
    { label: "Giải Nhất", value: 1 },
    { label: "Giải Nhì", value: 2 },
    { label: "Giải Ba", value: 3 },
  ];

  const mediaByType = [
    { label: "Hình ảnh", value: 15 },
    { label: "Video", value: 7 },
    { label: "PDF", value: 5 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Thống kê cuộc thi
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap={3}>
        {stats.map((item, index) => (
          <Box key={index}>
            <StatCard {...item} />
          </Box>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={3} mt={5}>
        <Box>
          <Typography variant="h6">Thí sinh theo nhóm</Typography>
          <BarChart
            height={300}
            series={[{ data: contestantsByGroup.map(d => d.value), label: "Số thí sinh" }]}
            xAxis={[{ data: contestantsByGroup.map(d => d.label), scaleType: "band" }]}
          />
        </Box>
        <Box>
          <Typography variant="h6">Trận đấu theo vòng</Typography>
          <BarChart
            height={300}
            series={[{ data: matchesByRound.map(d => d.value), label: "Trận đấu" }]}
            xAxis={[{ data: matchesByRound.map(d => d.label), scaleType: "band" }]}
          />
        </Box>
        <Box>
          <Typography variant="h6">Giải thưởng theo hạng</Typography>
          <BarChart
            height={300}
            series={[{ data: awardsByRank.map(d => d.value), label: "Số giải" }]}
            xAxis={[{ data: awardsByRank.map(d => d.label), scaleType: "band" }]}
          />
        </Box>
        <Box>
          <Typography variant="h6">Tài nguyên Media theo loại</Typography>
          <BarChart
            height={300}
            series={[{ data: mediaByType.map(d => d.value), label: "Số lượng" }]}
            xAxis={[{ data: mediaByType.map(d => d.label), scaleType: "band" }]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Dashboard);
