import React from "react";
import { BarChart as IconBarChart } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { ChartBarIcon, TrophyIcon } from "@heroicons/react/24/outline";

interface ChartDisplayProps {
  title?: string;
  chartData?: { label: string; value: number }[] | null;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData = [],
  title,
}) => {
  const COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#F59E0B",
    "#EF4444",
    "#10B981",
    "#F97316",
    "#3B82F6",
    "#EC4899",
    "#22C55E",
    "#EAB308",
    "#0EA5E9",
    "#A855F7",
    "#F472B6",
    "#EAB308",
    "#0EA5E9",
    "#A855F7",
    "#F472B6",
  ];

  // Tính tổng số phiếu
  const total = chartData?.reduce((sum, item) => sum + item.value, 0);

  // Gán màu và phần trăm
  const barChartData = chartData?.map((item, index) => ({
    ...item,
    percentage:
      total === 0 ? 0 : Number(((item.value / (total ?? 1)) * 100).toFixed(1)),
    fill: COLORS[index % COLORS.length],
  }));

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
              {title || "Biểu đồ thống kê câu hỏi"}
            </h1>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {chartData?.length === 0 ? (
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <div className="bg-white rounded-3xl p-8 shadow-lg border text-center max-w-md mx-auto">
                <IconBarChart sx={{ fontSize: 64 }} />
                <h3 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Chưa có dữ liệu thống kê
                </h3>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid gap-2 sm:gap-4 mb-2 sm:mb-4 min-h-0 overflow-hidden">
              {/* Biểu đồ cột */}
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                          `${value} câu`,
                          "Số câu",
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
                        payload={barChartData?.map(item => ({
                          value: `${item.label} (${item.value} - ${item.percentage}%)`,
                          type: "rect",
                          color: item.fill,
                        }))}
                      />
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        label={({ x, y, value, width, index }) => {
                          const percent = barChartData?.[index]?.percentage;
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
                        {barChartData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            stroke="#e5e7eb"
                            strokeWidth={1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay;
