import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  UserGroupIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { userChartData } from "@features/match/hooks/useControls";

import { Box, CircularProgress } from "@mui/material";

interface RescueStatsDisplayProps {
  rescueId: number;
}

const RescueStatsDisplay: React.FC<RescueStatsDisplayProps> = ({
  rescueId,
}) => {
  const [chartData, setChartData] = React.useState<
    { label: string; value: number }[]
  >([]);
  const {
    data: chartDataRes,
    isLoading: isLoadingChartData,
    isError: isErrorChartData,
    refetch: refetchChartData,
  } = userChartData(rescueId);

  useEffect(() => {
    refetchChartData();
  }, [rescueId, refetchChartData]);

  useEffect(() => {
    if (chartDataRes) {
      setChartData(chartDataRes.data || []);
    }
  }, [chartDataRes]);

  const COLORS = [
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F97316", // Orange
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#22C55E", // Green
    "#EAB308", // Yellow
    "#0EA5E9", // Sky
    "#A855F7", // Violet
    "#F472B6", // Rose
    "#EAB308", // Yellow
    "#0EA5E9", // Sky
    "#A855F7", // Violet
    "#F472B6", // Rose
  ];

  // Sắp xếp giảm dần và giới hạn 12 phần tử
  const top12 = [...chartData].sort((a, b) => b.value - a.value).slice(0, 6);

  // Tổng phiếu của 12 mục này
  const totalVotes = top12.reduce((sum, item) => sum + item.value, 0);

  // Bar Chart Data
  const barChartData = top12.map((item, index) => ({
    ...item,
    percentage:
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0",
    fill: COLORS[index % COLORS.length],
  }));

  // Pie Chart Data (same top12)
  const pieChartData = top12.map((item, index) => ({
    ...item,
    name: `${item.label} (${item.value} phiếu - ${
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0"
    }%)`,
    percentage:
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0",
    fill: COLORS[index % COLORS.length],
  }));

  if (isLoadingChartData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorChartData) return <div>Không thể tải dữ liệu</div>;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="w-full h-full flex flex-col p-2 sm:p-4 box-border overflow-hidden">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-4 flex-shrink-0">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full mr-2">
              <TrophyIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              THỐNG KÊ TRỢ GIÚP KHÁN GIẢ
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-700">
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-lg lg:text-2xl font-medium">
                {totalVotes} lượt bình chọn
              </span>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {chartData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <div className="bg-white rounded-3xl p-8 shadow-lg border text-center max-w-md mx-auto">
                <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Chưa có dữ liệu bình chọn
                </h3>
                <p className="text-lg lg:text-2xl text-gray-600">
                  Khán giả chưa bắt đầu bình chọn...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Biểu đồ */}
              <div className="flex-1 grid  gap-2 sm:gap-4 mb-2 sm:mb-4 min-h-0 overflow-hidden">
                {chartData.length >= 7 ? (
                  <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg border flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-center mb-2 flex-shrink-0">
                      <ChartBarIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 mr-1 sm:mr-2" />
                      <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800">
                        Biểu đồ cột
                      </h3>
                    </div>
                    <div className="w-full h-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ top: 40, right: 15, left: 10, bottom: 60 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{
                              fill: "#374151",
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          />
                          <YAxis tick={{ fill: "#374151", fontSize: 14 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              color: "#374151",
                              fontSize: "12px",
                            }}
                            formatter={(value: number) => [
                              `${value} phiếu`,
                              "Số phiếu",
                            ]}
                          />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="rect"
                            wrapperStyle={{
                              paddingTop: "20px",
                              lineHeight: "24px",
                              fontSize: "16px",
                              color: "#374151",
                              fontWeight: "500",
                            }}
                            payload={barChartData.map(item => ({
                              value: `${item.label} (${item.value} - ${item.percentage}%)`,
                              type: "rect",
                              color: item.fill,
                            }))}
                          />
                          <Bar
                            dataKey="value"
                            radius={[4, 4, 0, 0]}
                            label={({ x, y, value, width, index }) => {
                              const percent = barChartData[index].percentage;
                              return (
                                <text
                                  x={x + width / 2}
                                  y={y - 6}
                                  textAnchor="middle"
                                  fill="#111827"
                                  fontSize={12}
                                  fontWeight={500}
                                >
                                  {value} ({percent}%)
                                </text>
                              );
                            }}
                          >
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg border flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-center mb-2 flex-shrink-0">
                      <SparklesIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 mr-1 sm:mr-2" />
                      <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800">
                        Biểu đồ tròn
                      </h3>
                    </div>
                    <div className="w-full h-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                          margin={{ top: 10, right: 15, left: 10, bottom: 60 }}
                        >
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius="75%"
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              color: "#374151",
                              fontSize: "12px",
                            }}
                            formatter={(value: number) => [
                              `${value} phiếu`,
                              "Số phiếu",
                            ]}
                          />
                          {/* Legend bên trong biểu đồ */}
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            wrapperStyle={{
                              paddingTop: "20px",
                              lineHeight: "28px",
                              fontSize: "18px",
                              color: "#374151",
                              fontWeight: "500",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescueStatsDisplay;
