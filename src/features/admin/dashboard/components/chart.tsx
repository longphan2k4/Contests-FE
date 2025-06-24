import React from "react";
import { Box, Paper, Typography, Tooltip } from "@mui/material";

interface ChartItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  title: string;
  data: ChartItem[];
  color?: string;
  height?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  title,
  data,
  color = "#1976d2",
  height = 300, // tổng chiều cao vùng biểu đồ
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Container với height cố định */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          height: `${height}px`,
          overflow: "hidden",
        }}
      >
        {data.map((item, index) => {
          const barHeightPx =
            maxValue > 0 ? (item.value / maxValue) * height : 0;

          return (
            <Tooltip key={index} title={`${item.label}: ${item.value}`}>
              <Box
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                width={40}
              >
                <Box
                  sx={{
                    height: `${barHeightPx}px`, // ✅ sử dụng px thay vì %
                    width: "100%",
                    backgroundColor: color,
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
                <Typography variant="caption" mt={0.5}>
                  {item.label}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SimpleBarChart;
