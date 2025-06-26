import React, { useState, useEffect, useCallback } from "react";
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
import { getRescueChart } from "../../../audience/services/rescueService";
import { useSocket } from "../../../../contexts/SocketContext";
import type { ChartDataItem } from "../../../audience/types/rescue";

interface RescueStatsDisplayProps {
  rescueId: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: string;
}

const RescueStatsDisplay: React.FC<RescueStatsDisplayProps> = ({
  rescueId,
}) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  // Màu sắc hiện đại cho biểu đồ
  const COLORS = [
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#10B981", // Emerald
    "#F97316", // Orange
    "#3B82F6", // Blue
    "#EC4899", // Pink
  ];

  // Fetch dữ liệu biểu đồ - wrapped with useCallback
  const fetchChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRescueChart(rescueId);
      if (response.success && response.data) {
        setChartData(response.data);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching chart data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [rescueId]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Socket listener for refresh commands
  useEffect(() => {
    if (!socket) return;

    const handleRefreshChart = (data: { rescueId: number }) => {
      if (data.rescueId === rescueId) {
        fetchChartData();
      }
    };

    socket.on("audience:refreshChart", handleRefreshChart);

    return () => {
      socket.off("audience:refreshChart", handleRefreshChart);
    };
  }, [socket, rescueId, fetchChartData]);

  // Chuẩn bị dữ liệu cho biểu đồ
  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

  const barChartData = chartData.map((item, index) => ({
    ...item,
    percentage:
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0",
    fill: COLORS[index % COLORS.length],
  }));

  const pieChartData = chartData.map((item, index) => ({
    ...item,
    name: `${item.label} (${item.value} phiếu - ${
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0"
    }%)`,
    percentage:
      totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : "0",
    fill: COLORS[index % COLORS.length],
  }));

  // Custom label cho Pie Chart
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null; // Không hiển thị % nếu quá nhỏ

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="16"
        fontWeight="bold"
        stroke="#000"
        strokeWidth="0"
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-400 border-t-transparent mx-auto mb-8"></div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Đang tải thống kê...
          </h2>
          <p className="text-xl text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-6">
            <svg
              className="w-24 h-24 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Cứu trợ đã hết hạn
          </h2>
          <p className="text-xl text-gray-600">
            Cứu trợ đã hết hạn, không thể gửi đáp án
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main content */}
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full mr-4">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              THỐNG KÊ TRỢ GIÚP KHÁN GIẢ
            </h1>
          </div>

          <div className="flex items-center justify-center space-x-8 text-gray-700">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="w-6 h-6" />
              <span className="text-2xl font-medium">
                {totalVotes} lượt bình chọn
              </span>
            </div>
          </div>
        </div>

        {/* Question content */}
        {/* <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg border">
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              dangerouslySetInnerHTML={{ __html: questionContent }}
            />
          </div>
        </div> */}

        {chartData.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-lg border">
              <UserGroupIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-gray-800 mb-4">
                Chưa có dữ liệu bình chọn
              </h3>
              <p className="text-2xl text-gray-600">
                Khán giả chưa bắt đầu bình chọn...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border">
              <div className="flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-3xl font-bold text-gray-800">
                  Biểu đồ cột
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#374151", fontSize: 20 }}
                    axisLine={{ stroke: "#9ca3af" }}
                  />
                  <YAxis
                    tick={{ fill: "#374151", fontSize: 20 }}
                    axisLine={{ stroke: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      color: "#374151",
                      fontSize: "20px",
                    }}
                    formatter={(value: number, _name, props) => [
                      `${value} phiếu (${props.payload.percentage}%)`,
                      "Số phiếu",
                    ]}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border">
              <div className="flex items-center justify-center mb-6">
                <SparklesIcon className="w-8 h-8 text-indigo-600 mr-3" />
                <h3 className="text-3xl font-bold text-gray-800">
                  Biểu đồ tròn
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="60%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={200}
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
                      borderRadius: "12px",
                      color: "#374151",
                      fontSize: "20px",
                    }}
                    formatter={(value: number) => [
                      `${value} phiếu`,
                      "Số phiếu",
                    ]}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    wrapperStyle={{
                      paddingLeft: "20px",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {chartData.map((item, index) => {
              const percentage =
                totalVotes > 0
                  ? ((item.value / totalVotes) * 100).toFixed(1)
                  : "0";
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border text-center transform hover:scale-105 transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {item.label}
                  </h4>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {item.value}
                  </div>
                  <div className="text-lg text-gray-600">{percentage}%</div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RescueStatsDisplay;
